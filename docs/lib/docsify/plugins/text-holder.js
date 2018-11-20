;(function(win) {
    win.TextHolder = {};

    var ifEmptyStringThen = function(text, defaultText) {
        if (text === undefined || text === null || !text.length) {
            if (defaultText === null || defaultText === undefined) {
                defaultText = '';
            }
            return defaultText;
        }
        return text;
    };
    var defualtConversions = {
        upperCase: function(text) {
            return text.toUpperCase();
        },
        lowerCase: function(text) {
            return text.toLowerCase();
        },
        '??': ifEmptyStringThen,
        '>': function(obj, key, defaultText) {
            if (obj === null || typeof obj !== 'object') {
                obj = {};
            }
            return ifEmptyStringThen(obj[key], defaultText);
        },
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent
    };

    var getUrlSearch = function(key = null, search = null) {
        var params = {};
        search = search === null ? window.location.search : search;
        if (search.length > 1) {
            if (search[0] === '?') {
                search = search.substr(1);
            }
            var searchArr = search.split('&');
            for (var pair of searchArr) {
                var pairValues = pair.split('=', 2);
                if (pairValues.length > 1) {
                    try {
                        params[pairValues[0]] = decodeURIComponent(pairValues[1]);
                    } catch (_) {
                        params[pairValues[0]] = '';
                    }
                } else {
                    params[pairValues[0]] = '';
                }
            }
        }
        return key ? params[key] : params;
    };

    function replaceConfig(content, config, conversions, prefixKey) {
        config[''] = '';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var value = config[key];
                if (typeof value === 'function') {
                    value = value();
                }
                if (typeof value === 'object' && value !== null) {
                    content = replaceConfig(content, value, conversions, key);
                }
                var regStr = '\\$\\{(' + ((prefixKey !== undefined && prefixKey !== null) ? (prefixKey + '\\.') : '') + key + ':?[^\\}]*)\\}';
                content = content.replace(new RegExp(regStr, 'g'), function(_, match) {
                    var matchArr = match.split(':');
                    var result = (value === null || value === undefined) ? '' : value;
                    if (matchArr.length > 1) {
                        for (var i = 1; i < matchArr.length; ++i) {
                            var conversionInfo = matchArr[i].split(',');
                            var conversionName = conversionInfo.shift();
                            var conversion = conversions[conversionName] || defualtConversions[conversionName];
                            if (typeof conversion === 'function') {
                                conversionInfo.splice(0, 0, result);
                                result = conversion.apply(null, conversionInfo);
                            }
                        }
                    }
                    return result;
                });
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
                var hash = window.location.hash;
                var hashSearchIndex = hash.lastIndexOf('?');
                config._urlSearch = hashSearchIndex > -1 ? getUrlSearch(null, hash.substr(hashSearchIndex)) : {};
                var newContent = replaceConfig(content, config, conversions);
                return newContent;
            });

            hook.afterEach(function(html) {
                return html;
            });
        };
    }

    win.TextHolder.create = create
  }) (window);