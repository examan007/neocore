loadAPI: Promise<any>;

constructor() {
    this.loadAPI = new Promise((resolve) => {
        this.loadScript();
        resolve(true);
    });
}

public loadScript(scripturi, srckey) {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes(srckey)) {
            isFound = true;
        }
    }

    if (!isFound) {
        var dynamicScripts = [scripturi];

        for (var i = 0; i < dynamicScripts .length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}
