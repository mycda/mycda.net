/**
 * HOWTO: for any visual composer row that has the same basic structure in each column add the class: evenRowChildenHeight
 * The evenRowChildren function will then recursively look through the structure of the columns and fix height discrepancies.
 *
 * @see: https://jsfiddle.net/fczbkk/4bpqce2y/
 *
 */
// var c = window.console; //todo: debugging on
var c = {
    log: function () {
    },
    debug: function () {
    },
    table: function () {
    }
}; //todo: debugging off
var cssgen;
__trees_debug__ = [];
__trees__ = [];
var evenRowChildren = {
    config: {
        resizeImages: false,
        nonContainerElements: ['IMG', 'BR']
    },
    deps: function () {
        (function () {
            c.debug('defining CssSelectorGenerator...');
            window.CssSelectorGenerator = function () {
            };
            window.__indexOf = [].indexOf || function (item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                };

            CssSelectorGenerator = (function () {
                CssSelectorGenerator.prototype.default_options = {
                    selectors: ['tag', 'id', 'class', 'nthchild']
                };

                function CssSelectorGenerator(options) {
                    if (options == null) {
                        options = {};
                    }
                    this.options = {};
                    this.setOptions(this.default_options);
                    this.setOptions(options);
                }

                CssSelectorGenerator.prototype.setOptions = function (options) {
                    var key, val, _results;
                    if (options == null) {
                        options = {};
                    }
                    _results = [];
                    for (key in options) {
                        val = options[key];
                        if (this.default_options.hasOwnProperty(key)) {
                            _results.push(this.options[key] = val);
                        } else {
                            _results.push(void 0);
                        }
                    }
                    return _results;
                };

                CssSelectorGenerator.prototype.isElement = function (element) {
                    return !!((element != null ? element.nodeType : void 0) === 1);
                };

                CssSelectorGenerator.prototype.getParents = function (element) {
                    var current_element, result;
                    result = [];
                    if (this.isElement(element)) {
                        current_element = element;
                        while (this.isElement(current_element)) {
                            result.push(current_element);
                            current_element = current_element.parentNode;
                        }
                    }
                    return result;
                };

                CssSelectorGenerator.prototype.getTagSelector = function (element) {
                    return element.tagName.toLowerCase();
                };

                CssSelectorGenerator.prototype.sanitizeItem = function (item) {
                    return escape(item).replace(/\%/g, '\\');
                };

                CssSelectorGenerator.prototype.validateId = function (id) {
                    if (id == null) {
                        return false;
                    }
                    if (/^\d/.exec(id)) {
                        return false;
                    }
                    if (document.querySelectorAll("#" + id).length !== 1) {
                        return false;
                    }
                    return true;
                };

                CssSelectorGenerator.prototype.getIdSelector = function (element) {
                    var id;
                    id = element.getAttribute('id');
                    if (id != null) {
                        id = this.sanitizeItem(id);
                    }
                    id = this.validateId(id) ? id = "#" + id : id = null;
                    return id;
                };

                CssSelectorGenerator.prototype.getClassSelectors = function (element) {
                    var class_string, item, result;
                    result = [];
                    class_string = element.getAttribute('class');
                    if (class_string != null) {
                        class_string = class_string.replace(/\s+/g, ' ');
                        class_string = class_string.replace(/^\s|\s$/g, '');
                        if (class_string !== '') {
                            result = (function () {
                                var _i, _len, _ref, _results;
                                _ref = class_string.split(/\s+/);
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    item = _ref[_i];
                                    _results.push("." + (this.sanitizeItem(item)));
                                }
                                return _results;
                            }).call(this);
                        }
                    }
                    return result;
                };

                CssSelectorGenerator.prototype.getAttributeSelectors = function (element) {
                    var attribute, blacklist, result, _i, _len, _ref, _ref1;
                    result = [];
                    blacklist = ['id', 'class'];
                    _ref = element.attributes;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        attribute = _ref[_i];
                        if (_ref1 = attribute.nodeName, __indexOf.call(blacklist, _ref1) < 0) {
                            result.push("[" + attribute.nodeName + "=" + attribute.nodeValue + "]");
                        }
                    }
                    return result;
                };

                CssSelectorGenerator.prototype.getNthChildSelector = function (element) {
                    var counter, parent_element, sibling, siblings, _i, _len;
                    parent_element = element.parentNode;
                    if (parent_element != null) {
                        counter = 0;
                        siblings = parent_element.childNodes;
                        for (_i = 0, _len = siblings.length; _i < _len; _i++) {
                            sibling = siblings[_i];
                            if (this.isElement(sibling)) {
                                counter++;
                                if (sibling === element) {
                                    return ":nth-child(" + counter + ")";
                                }
                            }
                        }
                    }
                    return null;
                };

                CssSelectorGenerator.prototype.testSelector = function (element, selector) {
                    var is_unique, result;
                    is_unique = false;
                    if ((selector != null) && selector !== '') {
                        result = element.ownerDocument.querySelectorAll(selector);
                        if (result.length === 1 && result[0] === element) {
                            is_unique = true;
                        }
                    }
                    return is_unique;
                };

                CssSelectorGenerator.prototype.getAllSelectors = function (element) {
                    var result;
                    result = {
                        t: null,
                        i: null,
                        c: null,
                        a: null,
                        n: null
                    };
                    if (__indexOf.call(this.options.selectors, 'tag') >= 0) {
                        result.t = this.getTagSelector(element);
                    }
                    if (__indexOf.call(this.options.selectors, 'id') >= 0) {
                        result.i = this.getIdSelector(element);
                    }
                    if (__indexOf.call(this.options.selectors, 'class') >= 0) {
                        result.c = this.getClassSelectors(element);
                    }
                    if (__indexOf.call(this.options.selectors, 'attribute') >= 0) {
                        result.a = this.getAttributeSelector(element);
                    }
                    if (__indexOf.call(this.options.selectors, 'nthchild') >= 0) {
                        result.n = this.getNthChildSelector(element);
                    }
                    return result;
                };

                CssSelectorGenerator.prototype.testUniqueness = function (element, selector) {
                    var found_elements, parent;
                    parent = element.parentNode;
                    found_elements = parent.querySelectorAll(selector);
                    return found_elements.length === 1 && found_elements[0] === element;
                };

                CssSelectorGenerator.prototype.getUniqueSelector = function (element) {
                    var all_classes, selector, selectors;
                    selectors = this.getAllSelectors(element);
                    if (selectors.i != null) {
                        return selectors.i;
                    }
                    if (this.testUniqueness(element, selectors.t)) {
                        return selectors.t;
                    }
                    if (selectors.c.length !== 0) {
                        all_classes = selectors.c.join('');
                        selector = all_classes;
                        if (this.testUniqueness(element, selector)) {
                            return selector;
                        }
                        selector = selectors.t + all_classes;
                        if (this.testUniqueness(element, selector)) {
                            return selector;
                        }
                    }
                    return selectors.n;
                };

                CssSelectorGenerator.prototype.getSelector = function (element) {
                    var all_selectors, item, parents, result, selector, selectors, _i, _j, _len, _len1;
                    all_selectors = [];
                    parents = this.getParents(element);
                    for (_i = 0, _len = parents.length; _i < _len; _i++) {
                        item = parents[_i];
                        selector = this.getUniqueSelector(item);
                        if (selector != null) {
                            all_selectors.push(selector);
                        }
                    }
                    selectors = [];
                    for (_j = 0, _len1 = all_selectors.length; _j < _len1; _j++) {
                        item = all_selectors[_j];
                        selectors.unshift(item);
                        result = selectors.join(' > ');
                        if (this.testSelector(element, result)) {
                            return result;
                        }
                    }
                    return null;
                };

                return CssSelectorGenerator;

            })();
        }).call(this);
    },
    init: function (classRowSelector) {
        if (typeof window.CssSelectorGenerator === 'undefined') {
            this.deps();
        }
        cssgen = new CssSelectorGenerator();
        Array.prototype.slice.call(document.querySelectorAll(classRowSelector)).forEach(function (_, i) {
            c.log('i1 :: ', i);
            evenRowChildren.recurseChildren(cssgen.getSelector(_), cssgen);
        });
    },
    recurseChildren: function (classRowSelector, cssgen) {
        var __tree__ = [];
        Array.prototype.slice.call(document.querySelectorAll(classRowSelector + ' > div')).forEach(function (_, i) {
            c.log('i2 :: ', i);
            __tree__[i] = [];
            evenRowChildren.walkTheDOM(_, function (__) {
                if (__.nodeType === 1 && __.nodeName != 'IMG' && __.nodeName != 'BR') {
                    c.debug(__);
                    var tempSelector = cssgen.getSelector(__);
                    __tree__[i].push({
                        'index': i,
                        'ref': tempSelector,
                        'offsetHeight': __.offsetHeight,
                        'depth': evenRowChildren.depth(_.parentElement, tempSelector)
                    });
                }
            });
        });
        __trees_debug__.push(__tree__);
        /**
         * @start
         * walk up the tree logic
         */
        var start_pruning_tree = !!__tree__.map(function (_) {
            return _.length;
        }).reduce(function (__, _) {
            return (__ === _) ? __ : NaN;
        });
        if (!start_pruning_tree) {
            var __indx_standard__ = [];
            var __indx_nonstandard__ = [];
            var __max_elm_num_in_cols__ = __tree__.map(function (_) {
                return _.length;
            }).sort().reduce(function (__, _) {
                return __ > _ ? __ : _;
            });
            __tree__.forEach(function (_) {
                (_.length == __max_elm_num_in_cols__ ? __indx_standard__ : __indx_nonstandard__).push(_);
            });
            function walkUp(tree_branch) {
                return __indx_standard__[0].find(function (_) {
                    return _.ref === cssgen.getSelector(document.querySelector(tree_branch).parentElement);
                });
            }

            var walk_up_starting_query = __indx_standard__[0][__indx_nonstandard__[0].length - 1].ref;
            var continue_looking_for_consistant_branch = true;
            var temp_parent_branch_tree = null;
            var temp_walk_up_branch = null;
            var temp_walk_up_depth = null;
            while (continue_looking_for_consistant_branch) {
                temp_walk_up_branch = walkUp(walk_up_starting_query);
                temp_walk_up_depth = temp_walk_up_branch.depth;
                c.log('temp_walk_up_branch', temp_walk_up_branch);
                c.log('temp_walk_up_depth: ', temp_walk_up_depth);
                temp_parent_branch_tree = __tree__.map(function (_) {
                    return _.filter(function (_) {
                        return _.depth == temp_walk_up_depth;
                    });
                });
                c.log('temp_parent_branch_tree', temp_parent_branch_tree);
                var found_consistant_branch_depth = true;
                var hold = temp_parent_branch_tree[0].length;
                temp_parent_branch_tree.map(function (_) {
                    return _.length;
                }).forEach(function (_) {
                    if (hold != _) {
                        found_consistant_branch_depth = false;
                    }
                });
                continue_looking_for_consistant_branch = !found_consistant_branch_depth;
                c.log('found_consistant_branch_depth :: ', found_consistant_branch_depth);
                walk_up_starting_query = temp_walk_up_branch.ref;
            }
            c.debug('%c' + 'temp_walk_up_branch', 'color:Gold');
            c.log(temp_walk_up_branch);
            c.debug('%c' + 'temp_parent_branch_tree', 'color:Gold');
            c.log(temp_parent_branch_tree);
            var pruning_depth = temp_walk_up_branch.depth;
            __tree__ = __tree__.map(function (_) {
                return _.filter(function (__) {
                    return __.depth <= pruning_depth;
                });
            });
        }
        /**
         * @end
         * walk up the tree logic
         */
        var tl = __tree__.length;
        var ttl = __tree__[0].length;
        var __comp__ = [];
        for (var __ = ttl - 1; __ >= 0; __--) {
            c.debug('%c============================', 'color:MediumTurquoise');
            c.debug('%c' + 'inner :: ' + __, 'color:ForestGreen');

            var bool = true;
            for (var ___ = tl - 1; ___ >= 1; ___--) {
                c.debug('%c' + 'outer :: ' + ___, 'color:LimeGreen');

                var prev = __tree__[___][__];
                var cur = __tree__[(___ - 1)][__];

                c.log('prev :: ', document.querySelector(prev.ref));
                c.log('cur :: ', document.querySelector(cur.ref));

                c.log('prev.offsetHeight >>= ', prev.offsetHeight);
                c.log('cur.offsetHeight >>= ', cur.offsetHeight);

                if (prev.offsetHeight !== cur.offsetHeight) {
                    bool = false;
                    c.log(bool);
                }
            }
            __comp__.push(bool); // in __comp__ array false means elements at that index have varying heights
            c.debug('__comp__ >>= ', JSON.stringify(__comp__, null, 2));
        }
        c.table(__comp__);

        for (var ____ = ttl - 1; ____ >= 0; ____--) {
            if (!__comp__[____]) {
                var maximus = evenRowChildren.mapReduceMax(__tree__, Math.abs(ttl - ____ - 1), 'offsetHeight');
                c.log('maximus: ', maximus);
                for (var _____ = tl - 1; _____ >= 0; _____--) {
                    var querySelectorCur = document.querySelector(__tree__[_____][Math.abs(ttl - ____ - 1)].ref);
                    if((evenRowChildren.config.resizeImages ? true : (querySelectorCur.tagName !== 'IMG'))) {
                        c.log('fixing height for element... ');
                        c.log(querySelectorCur);
                        if(querySelectorCur.tagName === 'IMG'){
                            querySelectorCur.style.width = '100%';
                        }
                        querySelectorCur.style.height = maximus + 'px';
                    }
                }
            }
        }
        __trees__.push(__tree__);
    },
    walkTheDOM: function (node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            this.walkTheDOM(node, func);
            node = node.nextSibling;
        }
    },
    mapReduceMax: function (arr, indx, prop) {
        return arr.map(function (_) {
            return _[indx][prop];
        }).reduce(function (prev, cur) {
            return prev > cur ? prev : cur;
        });
    },
    depth: function (parent, descendantQuerySelector) {
        var descendant = document.querySelector(descendantQuerySelector);
        var depth = 0;
        while (!descendant.isEqualNode(parent)) {
            depth++;
            descendant = descendant.parentElement;
        }
        return depth;
    }
};
// jQuery(window).bind('load', function () {
window.addEventListener('load', function () {
    if(window.innerWidth >= 768){
        evenRowChildren.init('.evenRowChildrenHeight');
    }
});
(function () {

    window.addEventListener("resize", evenRowContentsResizeThrottler, false);

    var resizeTimeout;

    function evenRowContentsResizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                actualResizeHandler();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 500);
            //todo: 66 is default from mozilla.
        }
    }

    function actualResizeHandler() {
        if(window.innerWidth >= 768) {
            __trees__.forEach(function (tree) {
                tree.forEach(function (limb) {
                    limb.forEach(function (branch) {
                        var qs = document.querySelector(branch.ref);
                        if (!qs.classList.contains('vc_empty_space')) {
                            document.querySelector(branch.ref).style.height = null;
                        }
                    });
                });
            });
            evenRowChildren.init('.evenRowChildrenHeight');
            c.debug('resize handler...');
        }
    }
}());