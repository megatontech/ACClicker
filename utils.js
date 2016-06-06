//查找
function l(what) { return document.getElementById(what); }
//随机从数组中选择一个项
function choose(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
//转义表达式
function escapeRegExp(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
//替换字符串
function replaceAll(find, replace, str) { return str.replace(new RegExp(escapeRegExp(find), 'g'), replace); }
//禁用soundjay.com音频
//disable sounds coming from soundjay.com (sorry)
var realAudio = Audio;//backup real audio
Audio = function (src) {
    if (src.indexOf('soundjay') > -1) { Game.Popup('Sorry, no sounds hotlinked from soundjay.com.'); this.play = function () { }; }
    else return new realAudio(src);
};
//？？？？？？？？？？？
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) { return i; }
        }
        return -1;
    };
}
//小于一时向下取整，大于一向上取整
function randomFloor(x) { if ((x % 1) < Math.random()) return Math.floor(x); else return Math.ceil(x); }
//随机排列数组元素
function shuffle(array) {
    var counter = array.length, temp, index;
    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
//角度转弧度数组
var sinArray = [];
for (var i = 0; i < 360; i++) {
    //let's make a lookup table
    sinArray[i] = Math.sin(i / 360 * Math.PI * 2);
}
//快速转换弧度数组
function quickSin(x) {
    //oh man this isn't all that fast actually
    //why do I do this. why
    var sign = x < 0 ? -1 : 1;
    return sinArray[Math.round(
		(Math.abs(x) * 360 / Math.PI / 2) % 360
	)] * sign;
}
//美化数据？
//Beautify and number-formatting adapted from the Frozen Cookies add-on (http://cookieclicker.wikia.com/wiki/Frozen_Cookies_%28JavaScript_Add-on%29)
function formatEveryThirdPower(notations) {
    return function (value) {
        var base = 0,
		notationValue = '';
        if (value >= 1000000 && isFinite(value)) {
            value /= 1000;
            while (Math.round(value) >= 1000) {
                value /= 1000;
                base++;
            }
            if (base >= notations.length) { return 'Infinity'; } else { notationValue = notations[base]; }
        }
        return (Math.round(value * 1000) / 1000) + notationValue;
    };
}
//取整数精度三位数
function rawFormatter(value) { return Math.round(value * 1000) / 1000; }
//数字位数格式化
var numberFormatters =
[
	rawFormatter,
	formatEveryThirdPower([
		'',
		' million',
		' billion',
		' trillion',
		' quadrillion',
		' quintillion',
		' sextillion',
		' septillion',
		' octillion',
		' nonillion',
		' decillion',
		' undecillion',
		' duodecillion',
		' tredecillion',
		' quattuordecillion',
		' quindecillion'
	]),
	formatEveryThirdPower([
		'',
		' M',
		' B',
		' T',
		' Qa',
		' Qi',
		' Sx',
		' Sp',
		' Oc',
		' No',
		' Dc',
		' UnD',
		' DoD',
		' TrD',
		' QaD',
		' QiD'
	])
];
//格式化数值字符串
function Beautify(value, floats) {
    var negative = (value < 0);
    var decimal = '';
    if (value < 1000000 && floats > 0 && Math.floor(value.toFixed(floats)) != value.toFixed(floats)) decimal = '.' + (value.toFixed(floats).toString()).split('.')[1];
    value = Math.floor(Math.abs(value));
    var formatter = numberFormatters[Game.prefs.format ? 0 : 1];
    var output = formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return negative ? '-' + output : output + decimal;
}

var beautifyInTextFilter = /(([\d]+[,]*)+)/g;//new regex
var a = /\d\d?\d?(?:,\d\d\d)*/g;//old regex
function BeautifyInTextFunction(str) { return Beautify(parseInt(str.replace(/,/g, ''), 10)); };
function BeautifyInText(str) { return str.replace(beautifyInTextFilter, BeautifyInTextFunction); }//reformat every number inside a string
function BeautifyAll()//run through upgrades and achievements to reformat the numbers
{
    var func = function (what) { what.desc = BeautifyInText(what.baseDesc); }
    Game.UpgradesById.forEach(func);
    Game.AchievementsById.forEach(func);
}
//BASE64编码
function utf8_to_b64(str) {
    try { return Base64.encode(unescape(encodeURIComponent(str))); }
    catch (err)
    { return ''; }
}
//base64解码
function b64_to_utf8(str) {
    try { return decodeURIComponent(escape(Base64.decode(str))); }
    catch (err)
    { return ''; }
}
//二进制压缩
function CompressBin(arr)//compress a sequence like [0,1,1,0,1,0]... into a number like 54.
{
    var str = '';
    var arr2 = arr.slice(0);
    arr2.unshift(1);
    arr2.push(1);
    arr2.reverse();
    for (var i in arr2) {
        str += arr2[i];
    }
    str = parseInt(str, 2);
    return str;
}
//二进制解压
function UncompressBin(num)//uncompress a number like 54 to a sequence like [0,1,1,0,1,0].
{
    var arr = num.toString(2);
    arr = arr.split('');
    arr.reverse();
    arr.shift();
    arr.pop();
    return arr;
}
//大数据压缩
function CompressLargeBin(arr)//we have to compress in smaller chunks to avoid getting into scientific notation
{
    var arr2 = arr.slice(0);
    var thisBit = [];
    var bits = [];
    for (var i in arr2) {
        thisBit.push(arr2[i]);
        if (thisBit.length >= 50) {
            bits.push(CompressBin(thisBit));
            thisBit = [];
        }
    }
    if (thisBit.length > 0) bits.push(CompressBin(thisBit));
    arr2 = bits.join(';');
    return arr2;
}
//大数据解压
function UncompressLargeBin(arr) {
    var arr2 = arr.split(';');
    var bits = [];
    for (var i in arr2) {
        bits.push(UncompressBin(parseInt(arr2[i])));
    }
    arr2 = [];
    for (var i in bits) {
        for (var ii in bits[i]) arr2.push(bits[i][ii]);
    }
    return arr2;
}
//按位打包
function pack(bytes) {
    var chars = [];
    var len = bytes.length;
    for (var i = 0, n = len; i < n;) {
        chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
}
//按位解包
function unpack(str) {
    var bytes = [];
    var len = str.length;
    for (var i = 0, n = len; i < n; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
}
//按位打包2
//modified from http://www.smashingmagazine.com/2011/10/19/optimizing-long-lists-of-yesno-values-with-javascript/
function pack2(/* string */ values) {
    var chunks = values.match(/.{1,14}/g), packed = '';
    for (var i = 0; i < chunks.length; i++) {
        packed += String.fromCharCode(parseInt('1' + chunks[i], 2));
    }
    return packed;
}
//按位解包2
function unpack2(/* string */ packed) {
    var values = '';
    for (var i = 0; i < packed.length; i++) {
        values += packed.charCodeAt(i).toString(2).substring(1);
    }
    return values;
}
//文件保存
//file save function from https://github.com/eligrey/FileSaver.js
var saveAs = saveAs || function (view) { "use strict"; if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var doc = view.document, get_URL = function () { return view.URL || view.webkitURL || view }, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function (node) { var event = new MouseEvent("click"); node.dispatchEvent(event) }, is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent), webkit_req_fs = view.webkitRequestFileSystem, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem, throw_outside = function (ex) { (view.setImmediate || view.setTimeout)(function () { throw ex }, 0) }, force_saveable_type = "application/octet-stream", fs_min_size = 0, arbitrary_revoke_timeout = 500, revoke = function (file) { var revoker = function () { if (typeof file === "string") { get_URL().revokeObjectURL(file) } else { file.remove() } }; if (view.chrome) { revoker() } else { setTimeout(revoker, arbitrary_revoke_timeout) } }, dispatch = function (filesaver, event_types, event) { event_types = [].concat(event_types); var i = event_types.length; while (i--) { var listener = filesaver["on" + event_types[i]]; if (typeof listener === "function") { try { listener.call(filesaver, event || filesaver) } catch (ex) { throw_outside(ex) } } } }, auto_bom = function (blob) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) { return new Blob(["\ufeff", blob], { type: blob.type }) } return blob }, FileSaver = function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } var filesaver = this, type = blob.type, blob_changed = false, object_url, target_view, dispatch_all = function () { dispatch(filesaver, "writestart progress write writeend".split(" ")) }, fs_error = function () { if (target_view && is_safari && typeof FileReader !== "undefined") { var reader = new FileReader; reader.onloadend = function () { var base64Data = reader.result; target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/)); filesaver.readyState = filesaver.DONE; dispatch_all() }; reader.readAsDataURL(blob); filesaver.readyState = filesaver.INIT; return } if (blob_changed || !object_url) { object_url = get_URL().createObjectURL(blob) } if (target_view) { target_view.location.href = object_url } else { var new_tab = view.open(object_url, "_blank"); if (new_tab == undefined && is_safari) { view.location.href = object_url } } filesaver.readyState = filesaver.DONE; dispatch_all(); revoke(object_url) }, abortable = function (func) { return function () { if (filesaver.readyState !== filesaver.DONE) { return func.apply(this, arguments) } } }, create_if_not_found = { create: true, exclusive: false }, slice; filesaver.readyState = filesaver.INIT; if (!name) { name = "download" } if (can_use_save_link) { object_url = get_URL().createObjectURL(blob); setTimeout(function () { save_link.href = object_url; save_link.download = name; click(save_link); dispatch_all(); revoke(object_url); filesaver.readyState = filesaver.DONE }); return } if (view.chrome && type && type !== force_saveable_type) { slice = blob.slice || blob.webkitSlice; blob = slice.call(blob, 0, blob.size, force_saveable_type); blob_changed = true } if (webkit_req_fs && name !== "download") { name += ".download" } if (type === force_saveable_type || webkit_req_fs) { target_view = view } if (!req_fs) { fs_error(); return } fs_min_size += blob.size; req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) { fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) { var save = function () { dir.getFile(name, create_if_not_found, abortable(function (file) { file.createWriter(abortable(function (writer) { writer.onwriteend = function (event) { target_view.location.href = file.toURL(); filesaver.readyState = filesaver.DONE; dispatch(filesaver, "writeend", event); revoke(file) }; writer.onerror = function () { var error = writer.error; if (error.code !== error.ABORT_ERR) { fs_error() } }; "writestart progress write abort".split(" ").forEach(function (event) { writer["on" + event] = filesaver["on" + event] }); writer.write(blob); filesaver.abort = function () { writer.abort(); filesaver.readyState = filesaver.DONE }; filesaver.readyState = filesaver.WRITING }), fs_error) }), fs_error) }; dir.getFile(name, { create: false }, abortable(function (file) { file.remove(); save() }), abortable(function (ex) { if (ex.code === ex.NOT_FOUND_ERR) { save() } else { fs_error() } })) }), fs_error) }), fs_error) }, FS_proto = FileSaver.prototype, saveAs = function (blob, name, no_auto_bom) { return new FileSaver(blob, name, no_auto_bom) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } return navigator.msSaveOrOpenBlob(blob, name || "download") } } FS_proto.abort = function () { var filesaver = this; filesaver.readyState = filesaver.DONE; dispatch(filesaver, "abort") }; FS_proto.readyState = FS_proto.INIT = 0; FS_proto.WRITING = 1; FS_proto.DONE = 2; FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null; return saveAs }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) { module.exports.saveAs = saveAs } else if (typeof define !== "undefined" && define !== null && define.amd != null) { define([], function () { return saveAs }) }
//种子生成随机
//seeded random function, courtesy of http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
(function (a, b, c, d, e, f) { function k(a) { var b, c = a.length, e = this, f = 0, g = e.i = e.j = 0, h = e.S = []; for (c || (a = [c++]) ; d > f;) h[f] = f++; for (f = 0; d > f; f++) h[f] = h[g = j & g + a[f % c] + (b = h[f])], h[g] = b; (e.g = function (a) { for (var b, c = 0, f = e.i, g = e.j, h = e.S; a--;) b = h[f = j & f + 1], c = c * d + h[j & (h[f] = h[g = j & g + b]) + (h[g] = b)]; return e.i = f, e.j = g, c })(d) } function l(a, b) { var e, c = [], d = (typeof a)[0]; if (b && "o" == d) for (e in a) try { c.push(l(a[e], b - 1)) } catch (f) { } return c.length ? c : "s" == d ? a : a + "\0" } function m(a, b) { for (var d, c = a + "", e = 0; c.length > e;) b[j & e] = j & (d ^= 19 * b[j & e]) + c.charCodeAt(e++); return o(b) } function n(c) { try { return a.crypto.getRandomValues(c = new Uint8Array(d)), o(c) } catch (e) { return [+new Date, a, a.navigator.plugins, a.screen, o(b)] } } function o(a) { return String.fromCharCode.apply(0, a) } var g = c.pow(d, e), h = c.pow(2, f), i = 2 * h, j = d - 1; c.seedrandom = function (a, f) { var j = [], p = m(l(f ? [a, o(b)] : 0 in arguments ? a : n(), 3), j), q = new k(j); return m(o(q.S), b), c.random = function () { for (var a = q.g(e), b = g, c = 0; h > a;) a = (a + c) * d, b *= d, c = q.g(1); for (; a >= i;) a /= 2, b /= 2, c >>>= 1; return (a + c) / b }, p }, m(c.random(), b) })(this, [], Math, 256, 6, 52);
//绑定
function bind(scope, fn) {
    //use : bind(this,function(){this.x++;}) - returns a function where "this" refers to the scoped this
    return function () { fn.apply(scope, arguments); };
}
//画布渲染2D
CanvasRenderingContext2D.prototype.fillPattern = function (img, X, Y, W, H, iW, iH, offX, offY) {
    //for when built-in patterns aren't enough
    if (img.alt != 'blank') {
        var offX = offX || 0;
        var offY = offY || 0;
        if (offX < 0) { offX = offX - Math.floor(offX / iW) * iW; } if (offX > 0) { offX = (offX % iW) - iW; }
        if (offY < 0) { offY = offY - Math.floor(offY / iH) * iH; } if (offY > 0) { offY = (offY % iH) - iH; }
        for (var y = offY; y < H; y += iH) { for (var x = offX; x < W; x += iW) { this.drawImage(img, X + x, Y + y, iW, iH); } }
    }
}
//旧的画布绘图
var OldCanvasDrawImage = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function () {
    //only draw the image if it's loaded
    if (arguments[0].alt != 'blank') OldCanvasDrawImage.apply(this, arguments);
}
//如果没焦点就隐藏画面
if (!document.hasFocus) document.hasFocus = function () { return document.hidden; };//for Opera
//给元素添加事件
function AddEvent(html_element, event_name, event_function) {
    if (html_element.attachEvent) //Internet Explorer
        html_element.attachEvent("on" + event_name, function () { event_function.call(html_element); });
    else if (html_element.addEventListener) //Firefox & company
        html_element.addEventListener(event_name, event_function, false); //don't need the 'call' trick because in FF everything already works in the right way
}
//触发事件
function FireEvent(el, etype) {
    if (el.fireEvent)
    { el.fireEvent('on' + etype); }
    else
    {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}