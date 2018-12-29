function readSingleFile(obj, tag) {
    console.log('readSingleFile;');
    var element = document.getElementById('upload-' + obj.Key + tag);
    var file = element.files[0];
    if (!file) {
        return;
    }
    console.log('filename=[' + file + '] id=[' + element.id + ']');
    var key = obj.Key;
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents,key);
    };
    reader.readAsDataURL(file);
    var treader = new FileReader();
    function onload (key, reader) {
        return (function(e) {
            var maxsize = 26214400;
            var size = 26214400;
            var obj = Contacts.hashmap[key];
            var contents = new Uint8Array(reader.result); //btoa(reader.result);
            console.log('contents.length=[' + contents.length + ']');
            if (typeof(obj) === 'undefined') {
                alert('Contact key is undefined!');
            } else
            if (contents.length > maxsize) {
                alert('Image is too large to save! maximum size is [' + maxsize + ']');
            } else {
                obj.ProfileImage = {
                }
                obj.ProfileImage.contents = [];
                for (var i = 0; i < contents.length; i = i + size) {
                    if (contents.length - i < size) {
                        size = contents.length - i;
                    }
                    try {
                        function bufferToBase64(buf) {
                            var binstr = Array.prototype.map.call(buf, function (ch) {
                                return String.fromCharCode(ch);
                            }).join('');
                            return btoa(binstr);
                        }
                        var arr = null;
                        try {
                            arr = new Uint8Array(contents.slice(i, i + size));
                        } catch (e) {
                            arr = new Uint8Array(contents);
                        }
                        //var buffer = new Uint8Array(arr);
                        var b64encoded = bufferToBase64(arr);
                        obj.ProfileImage.contents.push(b64encoded);
                        console.log('Fragment length=[' + size + '] encoded=[' + b64encoded.length + ']');
                    } catch (e) {
                        alert('Image NOT saved; ' + e.toString());
                        delete (obj.ProfileImage);
                        break;
                    }
                }
            }
        });
    }
    treader.onload = onload(key, treader);
    //treader.readAsText(file);
    //treader.readAsBinaryString(file);
    treader.readAsArrayBuffer(file);
}
