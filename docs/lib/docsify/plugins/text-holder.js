;(function(win) {
    win.TextHolder = {};

    var defualtConversions = {
        upperCase: function(text) {
            return text.toUpperCase();
        },
        lowerCase: function(text) {
            return text.toLowerCase();
        },
    };

    function replaceConfig(content, config, conversions, prefixKey) {
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var value = config[key];
                if (typeof value === 'function') {
                    value = value();
                }
                if (typeof value === 'object' && value !== null) {
                    content = replaceConfig(content, value, conversions, key);
                } else {
                    var regStr = '\\$\\{(' + ((prefixKey !== undefined && prefixKey !== null) ? (prefixKey + '\\.') : '') + key + ':?[\\w:]*)\\}';
                    content = content.replace(new RegExp(regStr, 'g'), function(_, match) {
                        var matchArr = match.split(':');
                        var result = (value === null || value === undefined) ? '' : value;
                        if (matchArr.length > 1) {
                            for (var i = 1; i < matchArr.length; ++i) {
                                var conversionName = matchArr[i];
                                var conversion = conversions[conversionName] || defualtConversions[conversionName];
                                if (typeof conversion === 'function') {
                                    result = conversion(value);
                                }
                            }
                        }
                        return result;
                    });
                }
            }
        }
        return content;
    }

    function create(config, conversions) {
        config = config || window.$config || window.$docsify.textHolder;
        conversions = conversions || {};
        win.TextHolder.config = config

        return function(hook, vm) {
            hook.beforeEach(function(content) {
                return replaceConfig(content, config, conversions);
            });
        };
    }

    win.TextHolder.create = create
  }) (window);