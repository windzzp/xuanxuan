;(function(win) {
    win.jsdoc2md = {};

    function create(config) {
        config = config || window.$config || window.$docsify.jsdoc2md;
        win.jsdoc2md.config = config

        return function(hook, vm) {
            console.log(hook, vm);
            hook.beforeEach(function(content) {
                console.log('content', content);
                return content.replace(/<\/p>\./g, '</p>').replace(/<a href="#(.+)">/g, function(_, $1) {
                    return '<a href="#' + vm.route.path + '?id=' + ($1.toLowerCase()) + '">';
                }).replace(/<a name="(.+)"><\/a>/g, function(_, $1) {
                    return '<a id="' + $1.toLowerCase() + '"><\/a>';
                });
            });
        };
    }

    win.jsdoc2md.create = create
  }) (window);