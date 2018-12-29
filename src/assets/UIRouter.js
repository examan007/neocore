var UIRouter = {name: "unknown"};
execute_routerApp();
define(["require", "exports"], function(require, exports){
   exports.value = UIRouter.name;
   exports.getUIRouter = function () {
        return (UIRouter);
   }
   exports.getObjects = function () {
        return (UIRouter.objects);
   }
   exports.getTemplate = function () {
        return (UIRouter.template);
   }
   exports.getResults = function () {
        return (UIRouter.results);
   }
   exports.initUIRouter = function (component) {
       UIRouter.component = component;
       UIRouter.devicetype = component.getManager().isDevice();
       startApplication();
   }
   exports.readSingleFile = function (obj, suffix) {
        readSingleFile(obj, suffix);
   }
   exports.getTemplates = function () {
    return (UIRouter.templates);
   }
});
var UIRToolbar = null;
var UIRDropdown = null;
function execute_routerApp() {
    UIRouter.component = null;
    UIRouter.objects = [];
    UIRouter.results = [];
    UIRouter.options = [];
    UIRouter.ActiveObj = 'default';
    UIRouter.Current = 'default';
    UIRouter.devicetype = false;
    UIRouter.isDevice = function () {
      return (UIRouter.devicetype);
    }
    UIRouter.getOptions = function (obj) {
        console.log('getOptions ' + JSON.stringify(obj));
        return (UIRouter.options[obj.Key]);
    }
    UIRouter.findObject = function (key) {
        var ret =  null;
        UIRouter.objects.forEach( function (obj) {
            if (obj.Key === key) {
              ret = obj;
            }
        });
        return (ret);
    }
    UIRouter.update = function () {
        try {
            UIRouter.component.updateObjects();
         } catch (e) {
            console.log(e);
        }
    }
    UIRouter.initData = function (objmap, optmap) {
        UIRouter.objects = objmap;
        UIRouter.options = [];
        optmap.forEach( function (option) {
            if (typeof(option.Operation) === 'undefined') { } else {
                var operation = option.Operation.substr(1);
                console.log('initData operation=[' + operation + '] ' + JSON.stringify(option));
                if (typeof(UIRouter.options[operation]) === 'undefined') {
                    UIRouter.options[operation] = [];
                }
                UIRouter.options[operation].push(option);
            }
        });
        UIRouter.update();
    }
    UIRouter.setOptions =  function (objname) {
      for (option in UIRouter.options) {
        var options = UIRouter.options[option];
        for(elem in options) {
          var obj = options[elem];
          try {
              var test = obj.Operation;
              var tag = '#Dropdown' + test + '-' + obj.Key;
              if (objname === test) {
                  //console.log('setOptions();' +  JSON.stringify(obj));
                  //console.log('setOptions(); option=[' + test + '] opt=[' + option + ']');
                  //console.log('setOptions(); tag=[' + tag + '] objname=[' + objname + ']');
                  var filter = new String(obj.Filter);
                  if (typeof(filter) === 'undefined') {
                     $(tag).show();
                  } else
                  if (filter.indexOf('hidden') >= 0) {
                     $(tag).hide();
                  } else
                  if (filter.indexOf('private') < 0) {
                     $(tag).show();
                  } else
                  if (Controller.UserId.indexOf('nginx') >= 0) {
                     $(tag).hide();
                  } else {
                     $(tag).show();
                  }
              } else {
                   $(tag).hide();
              }
          } catch (e) {
              console.log('setOptions ' + e.toString());
          }
        }
      }
    }
    UIRouter.CheckState = '';
    UIRouter.select = function (obj, flag) {
        if (flag == false) {
          console.log('leave=' + JSON.stringify(obj));
          UIRouter.setOptions('-');
          UIRouter.CheckState = '';
        } else
        if (UIRouter.CheckState === obj.Key) {} else {
          console.log('obj=' + JSON.stringify(obj));
          UIRouter.setOptions('-' + obj.Key);
        }
    }
    UIRouter.execopt = function (obj, opt, flag) {
         UIRouter.select(obj, flag)
    }
    UIRouter.checkClick=  function (event, obj) {
        console.log('UIRouter.checkClick();' + JSON.stringify(obj));
        if (UIRouter.isDevice() == false) {
            console.log('checkClick() isDevice=false;' + JSON.stringify(obj));
            UIRouter.setOptions('-');
        } else
        if (obj.Key === UIRouter.CheckState) { } else {
            event.preventDefault();
        }
        UIRouter.CheckState = obj.Key;
    }
    UIRouter.initializeComplete = function () {
        initialize()();
        function initialize() {
            return (function () {
                UIRouter.initData(UIRToolbar.DataMap.map, UIRDropdown.DataMap.map);
                //run();
                UIRouter.setOptions('-');
                function run() {
                    angular.bootstrap(document.getElementById("Account"), ['useApp']);
                    Application.initialize();
                    Controller.startApp();
                }
            });
        }
    }
}
function startApplication() {
    ParamObj.getParametersData( function () {
        UIRToolbar = RepeatObj.addList('uirouter', '/assets/data/Toolbar.json', function () {
            console.log('toolbar=' + JSON.stringify(UIRToolbar.DataMap.map));
            Controller.readyToolbar();
            UIRDropdown = RepeatObj.addList('uioptions', '/assets/data/Dropdown.json', function () {
                Controller.readyToolbar();
                console.log('dropdown=' + JSON.stringify(UIRDropdown.DataMap.map));
                function initializeComplete() {
                    return (function () {
                        UIRouter.initializeComplete();
                    });
                }
                window.setTimeout(initializeComplete(), 1000);
            });
        });
    });
}


