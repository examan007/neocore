var Contacts = {contactname: "unknown"};
execute_ContactApp();
define(["require", "exports"], function(require, exports){
   exports.value = Contacts.contactname;
   exports.getContacts = function () {
        return (Contacts);
   }
   exports.getObjects = function () {
        return (Contacts.objects);
   }
   exports.getTemplate = function () {
        return (Contacts.template);
   }
   exports.getResults = function () {
        return (Contacts.results);
   }
   exports.initContacts = function (component) {
       Contacts.component = component;
       Contacts.Manager = component.getManager();
       Contacts.Manager.isDevice();
       initContacts();
   }
   exports.readSingleFile = function (obj, suffix) {
        readSingleFile(obj, suffix);
   }
   exports.getTemplates = function () {
    return (Contacts.templates);
   }
});
function execute_ContactApp() {
    Contacts.Manager = null;
    Contacts.component = null;
    Contacts.contactname = '';
    Contacts.results = [];
    Contacts.savedvalues = null;
    Contacts.weburl = '/';
    Contacts.Debug = 0;
    Contacts.modalobj = ModalObj('Contacts-Modal', []);
    Contacts.update = function () {
//        Contacts.scope.$apply();
        try {
            Contacts.component.updateObjects(Contacts.component);
        } catch (e) {
            console.log(e.toString())
        }
    }
    Contacts.getKey = function (obj) {
        return (obj.Name.replace(/\W+/g, "_"));
    }
    Contacts.exists = function (obj) {
        var ret = false;
        try {
            if (typeof(Contacts.hashmap[Contacts.getKey(obj)]) === 'undefined') {} else {
                ret = true;
            }
        } catch (e) {}
        return(ret);
    }
    Contacts.edit = function (obj) {
        console.log('edit obj=' + JSON.stringify(obj));
        obj.editclass = 'noshow';
        Contacts.savedvalues = JSON.parse(JSON.stringify(obj));
        toggleEdit(obj);
    }
    Contacts.refresh = function (obj) {
        toggleEdit(obj);
        console.log('saved=' + JSON.stringify(Contacts.savedvalues));
        try {
            if (Contacts.savedvalues == null) {} else
            if ( typeof (obj.Key) === 'undefined') {} else
            if ( typeof (Contacts.hashmap[obj.Key]) === 'undefined') {} else {
                obj = Contacts.hashmap[obj.Key];
                for(var k in Contacts.savedvalues) {
                    obj [k] = Contacts.savedvalues[k];
                }
                var done = true;
                do {
                    done = true;
                    for(var k in obj) {
                        if (typeof(Contacts.savedvalues[k]) === 'undefined') {
                            delete (obj[k]);
                            done = false;
                            break;
                        }
                    }
                } while (!done);
            }
            initImages(false);
        } catch (e) {
            console.log('refresh ' + e.toString());
        }
    }
    Contacts.getData = function (filename, data, success, failure) {
        if (Contacts.Debug < 1) { } else
        try {
            console.log('data=' + JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
        $.ajax({
            url: filename,
            type: 'GET',
            dataType: 'json',
            data: JSON.stringify(data),
            success: success,
            error: function (xhr, textStatus, error) {
                var err = {};
                try {
                    err = eval("(" + xhr.responseText + ")");
                } catch (e) {}
                console.log('xhr=' + JSON.stringify(err));
                failure('Error[ ' + JSON.stringify(err) + ']');
            }
        });
    }
    Contacts.sendData = function (data, success, failure) {
        if (Contacts.Debug < 1) { } else
        try {
            console.log('data=' + JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
        $.ajax({
            url: Contacts.weburl + 'private',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: success,
            error: function (xhr, textStatus, error) {
                var err = {};
                try {
                    err = eval("(" + xhr.responseText + ")");
                } catch (e) {}
                console.log('xhr=' + JSON.stringify(err));
                failure('Error[ ' + JSON.stringify(err) + ']');
            }
        });
    }
    Contacts.sendImage = function (data, success, failure) {
        if (Contacts.Debug < 1) { } else
        try {
            console.log('data=' + JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
        $.ajax({
            url: Contacts.weburl + 'images',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: success,
            error: function (xhr, textStatus, error) {
                var err = eval("(" + xhr.responseText + ")");
                console.log('xhr=' + JSON.stringify(err));
                failure('Error[ ' + JSON.stringify(err) + ']');
            }
        });
    }
    Contacts.save = function (obj) {
        obj.operation = 'update';
        var image = obj.ProfileImage;
        if (typeof(image) === 'undefined') {} else {
            delete (obj.ProfileImage)
            image.filename = 'data/' + obj.Key + '.' + (new Date()).getTime() + '.jpg';
            obj.LargeImage = image.filename;
            obj.SmallImage = image.filename;
            sendFrags(image)();
            function sendFrags (image) {
                return (function () {
                    var frag = image.contents.pop();
                    if (frag == null) {} else {
                        Contacts.sendImage({
                                contents: [frag],
                                filename: image.filename
                            }, sendFrags({
                                contents: image.contents,
                                filename: image.filename
                            }),
                            function (msg) {
                                alert(msg);
                            }
                        );
                    }
                });
            }
        }
        Contacts.sendData(obj, function (data) {
            console.log('sendData response=' + JSON.stringify(data));
            if (data.status === 'Error') {
                alert(data.message);
            } else {
                console.log('save obj=' + JSON.stringify(obj));
                obj.editclass = 'show';
                toggleEdit(obj);
            }
            Contacts.update();
        }, function (msg) {
            alert(msg);
        });
    }
    Contacts.remove = function (obj) {
        Contacts.results = [];
        Contacts.results.push({
            name: 'Are you sure?',
            message: 'Undo is not implemented; [' + obj.Name + '] will be lost!'
        });
        var modalobj = ModalObj('Contacts-Modal', [{
                prefix: '-close',
                method: function (modal) {
                    //Contacts.results = [];
                }
            },{
                prefix: '-ok',
                method: complete(obj)
            }]
        );
        Contacts.Manager.setToolTip();
        Contacts.update();
        modalobj.show();
        function complete (obj) {
            return (function () {
                //Contacts.results = [];
                console.log('remove obj=' + JSON.stringify(obj));
                obj.operation = 'delete';
                Contacts.sendData(obj, function (data) {
                    console.log('sendData response=' + JSON.stringify(data));
                    if (data.status === 'Error') {
                        alert(data.message);
                    } else {
                        console.log('remove post obj=' + JSON.stringify(obj));
                        for (var i = 0; i < Contacts.objects.length; i++) {
                            if (Contacts.objects[i].Key === obj.Key) {
                                Contacts.removeFromHashMap(obj);
                                Contacts.objects.splice(i, 1);
                                break;
                            }
                        }
                        Contacts.update();
                    }
                }, function (msg) {
                    alert(msg);
                });
            });
        }
    }
    Contacts.upload = function (obj, suffix) {
        //console.log('upload obj=' + JSON.stringify(obj));
        var tag = 'upload-' + obj.Key + suffix;
        var element = document.getElementById(tag);
        if (element == null) {
            alert('Cannot find ' + tag);
        } else {
            $(element).click();
        }
    }
    Contacts.create = function (contactname) {
        Contacts.contactname =contactname;
        console.log('create obj=[' + JSON.stringify(Contacts.contactname) + ']');
        var obj = {
            Name: Contacts.contactname,
            SmallImage: 'assets/nouserpic-50.png',
            LargeImage: 'assets/nouserpic-225.png',
            editclass: 'noshow',
            direction: 'up',
            operation: 'create'
        };
        toggleEdit(obj);
        obj.Key = Contacts.getKey(obj);
        if (Contacts.contactname.length <= 0) {
            alert('Name must be entered!');
        } else
        if (Contacts.exists(obj) == true) {
            alert('Name already exists!');
        } else {
            Contacts.sendData(obj, function (data) {
                console.log('sendData response=' + JSON.stringify(data));
                if (data.status === 'Error') {
                    alert(data.message);
                } else
                if (Contacts.addToHashMap(obj) == true) {
                    Contacts.objects.unshift(obj);
                    Contacts.contactname = '';
                    Contacts.update();
                    window.setTimeout(complete(obj), 0);
                    function complete(obj) {
                        var key = obj.Key;
                        return (function () {
                            try {
                                Contacts.Manager.setToolTip();
                                $('#' + key).show();
                            } catch (e) {
                                console.log('create=' + e.toString());
                            }
                        });
                    }
                } else {
                    alert('Error, unable to save to local hash map!');
                }
            }, function (msg) {
                alert(msg);
            });
        }
    }
    Contacts.search = function () {
        console.log('search obj=[' + JSON.stringify(Contacts.contactname) + ']');
        alert('Search is not implemented; this would allow specific contact selection from the URI as well.')
    }
    Contacts.showWithKey = function (dataFor, direction) {
        var idFor = $(dataFor);
        console.log('panelsButton' + JSON.stringify(dataFor));
        //current button
        idFor.slideToggle(400, function() {
            if (direction == true) {
                idFor.show();
            } else {
                idFor.hide();
            }
        })
    }
    Contacts.show = function (obj) {
        //Contacts.showWithKey(obj.attr('data-for'));
    }
    Contacts.expand = function (obj) {
        console.log('expand=' + JSON.stringify(obj));
        var panels = $('.user-infos');
        var direction = true;
        if (typeof(obj.direction) === 'undefined') {
            obj.direction = 'up';
        } else
        if (obj.direction === 'up') {
            obj.direction = 'down';
            direction = false;
        } else {
            obj.direction = 'up';
        }
        Contacts.showWithKey('#' + obj.Key, direction);
    }
    Contacts.exclusions = new Set(["Name", "Key", "editclass", "showclass", "loadclass", "direction"]);
    Contacts.templates = [];
    Contacts.objects = [];
    Contacts.hashmap = [];
    Contacts.addToHashMap = function (obj) {
        var ret = false;
        if (Contacts.exists(obj) == true) {
        } else {
            obj.Key = Contacts.getKey(obj);
            Contacts.hashmap[obj.Key] = obj;
            ret = true;
        }
        return (ret);
    }
    Contacts.removeFromHashMap = function (obj) {
        try {
            delete (Contacts.hashmap[obj.Key]);
        } catch (e) {
            console.log('remove' + e.toString());
        }
    }
    Contacts.ordering = {}
    Contacts.order = [
        "count",
        "datestamp",
        "user",
        "query"
        ];
    Contacts.order.forEach( function (name, i) {
        console.log("name=[" + name + "] index=[" + i + "]");
        Contacts.ordering[name] = i;
    });
    console.log(JSON.stringify(Contacts.ordering));
    Contacts.getTemplate = function (obj) {
        var temp = [];
        for (var property in obj) {
            if (!obj.hasOwnProperty(property)) {
                continue;
            }
            if (Contacts.exclusions.has(property)) {
                continue;
            }
            //console.log("Contacts.getTemplate(), [" + property + "]=[" + obj[property] + "]");
            temp.push({
                name: property,
                label: property
            });
        }
        function first(a, b, name) {
            if (a.name === 'timestamp') {
                return (-1);
            }
            if (b.namme === 'timestamp') {
                return (1);
            }
            return (a.name.localeCompare(b.name));
        }
        function order(a, b) {
            function getIndex(name) {
                var i = parseInt(Contacts.ordering[name]);
                if (isNaN(i)
                    ||
                    typeof(i) === 'undefined'
                    ||
                    i === 'undefined'
                    ) {
                    i = Contacts.order.length;
                }
                //console.log("getIndex(" + name + ")=[" + i + "]");
                return (i);
            }
            return (getIndex(a.name) - getIndex(b.name));
        }
        temp.sort(function (a, b) {
            //return (first(a, b, 'timestamp'));
            return (order(a, b));
        });
        return (temp);
    }
}
function initContacts() {
    function success(data) {
        //console.log(JSON.stringify(data));
        Contacts.objects = data;
        Contacts.objects.forEach( function (obj) {
            //console.log(JSON.stringify(obj));
            obj.editclass = 'show';
            obj.direction = 'down';
            delete (obj['$$hashKey']);
            toggleEdit(obj);
            if ( typeof (obj.Key) === 'undefined') {
                obj.Key = obj.timestamp;
            }
            if ( typeof (obj.Name) === 'undefined') {
                obj.Name = obj.timestamp;
            }
            Contacts.addToHashMap(obj);
            Contacts.templates[obj.Key] = Contacts.getTemplate(obj);
            // console.log("template=[" + JSON.stringify(Contacts.templates[obj.Key]))
            try {
			    var tag = '#' + obj.Key;
			    //console.log(tag);
			    $(tag).hide();
            } catch (e) {
                console.log(e.toString());
            }
        });
        Contacts.update();
        window.setTimeout(initImages, 10);
    }
    var props =  {
        operation: 'collate'
    }
    Contacts.getData("/collate", props, success,
    function (err) {
        Contacts.getData("/snapshot", "", success,
        function (err) {
            Contacts.getData("/data/data.json", "", success,
            function (err) {
                alert('Unable to retrieve contacts; ' + err);
                window.setTimeout(initContacts, 15000);
            });
        });
    });
}
function initImages(flag) {
    console.log('initImages ...');
    Contacts.Manager.setToolTip();
    $('button').click(function(e) {
        e.preventDefault();
    });
    var i = 0;
    try {
        // test(document.getElementById('ContactManager'));
        if (typeof(flag) === 'undefined') {
            Contacts.update();
        }
    } catch (e) {
        console.log(e.toString());
    }
    function test(element) {
        i++;
        // console.log('i=' + i + ' nodeName=' + element.nodeName);
        for ( var n = 0; n < element.childNodes.length; n++) {
            test(element.childNodes[n]);
        }
        function getsrc(element, value) {
            var src = Contacts.weburl + 'assets/nouserpic-50.png';
            if (value == null) { } else {
                try {
                    var key = element.attr('id');
                    key = key.substring(0, key.lastIndexOf('-'));
                    var obj = Contacts.hashmap[key];
                    if ( typeof(obj[value]) === 'undefined') {} else {
                        src = Contacts.weburl + obj[value]; //.replace('images', 'data');
                    }
                    console.log('value=[' + value + '] src=[' + src + ']');
                } catch (e) {
                    console.log('getsrc() ' + e.toString());
                }
            }
            return (src);
        }

        if (element.nodeName === 'IMG') {
            element.setAttribute('src', getsrc($(element), element.getAttribute('data-src')));
        }
    }
    if (Contacts.objects.length == 0) {
        Contacts.results = [];
        Contacts.results.push({
            name: 'No records available',
            message: 'Cannot establsih connection to the downstream logging agent.'
        });
        function create() {
            var modal = null;
            return (modal = ModalObj('Contacts-Modal', [{
                    prefix: 'ok',
                    name: 'Continue',
                    method: function () {
                        console.log("ModalObj onlcick()");
                        Contacts.results = [];
                        modal.hide()
                    }
                }]
            ));
        }
        Contacts.modalobj = create();
        Contacts.update();
        Contacts.modalobj.show()
    }
}

function toggleEdit(obj) {
    try {
        if (obj.editclass === 'show') {
            obj.editclass = 'noshow';
            obj.showclass = 'show';
            obj.loadclass = 'invisible';
        } else {
            obj.editclass = 'show';
            obj.showclass = 'noshow';
            obj.loadclass = 'visible';
        }
    } catch (e) {
        console.log('toggleEdit' + e.toString());
    }
    Contacts.Manager.setToolTip();
}


function displayContents(contents, key) {
    updatesrc('img-' + key);
    function updatesrc(tag) {
        var elements = document.getElementsByClassName(tag);
        console.log('display; tag=[' + tag + '] len=[' + elements.length + ']'); // contents=[' + contents + ']');
        for (var i = 0; i < elements.length; i++) {
            elements[i].setAttribute('src', contents);
        }
    }
    Contacts.update();
}

