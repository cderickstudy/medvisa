$ = jQuery;

(function($) {

    $(function() {

        var app = {
            init: function() {
                app.initialScripts();
                app.retriveData();
                app.filterChange();
            },
            initialScripts: function(){
                $('.hidecontroler').hide();
                $('.mainsearch').show();
                $('#home').click(function(){
                  $('.hidecontroler').hide();
                  $('.mainsearch').show();
                });
                $('.nav-link').click(function(){
                  var tt = $(this).data('gentabs');
                  $('.hidecontroler').hide();
                  $('.'+tt).show();
                });
            },
            retriveData: function() {
                $.getJSON('src/medicamentos.json').done(function(json) {
                    allData = json;
                    app.loadHydrogen(allData);
                });
            },
            loadHydrogen: function(allData) {
                  Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
                    var operators, result;
                    if (arguments.length < 3) {
                        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
                    }
                    if (options === undefined) {
                        options = rvalue;
                        rvalue = operator;
                        operator = "===";
                    }
                    operators = {
                        '==': function (l, r) { return l == r; },
                        '===': function (l, r) { return l === r; },
                        '!=': function (l, r) { return l != r; },
                        '!==': function (l, r) { return l !== r; },
                        '<': function (l, r) { return l < r; },
                        '>': function (l, r) { return l > r; },
                        '<=': function (l, r) { return l <= r; },
                        '>=': function (l, r) { return l >= r; },
                        'contains': function (l, r) { return l.indexOf(r) != -1; },
                        'typeof': function (l, r) { return typeof l == r; }
                    };
                    if (!operators[operator]) {
                        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
                    }
                    result = operators[operator](lvalue, rvalue);
                    if (result) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                });
                Handlebars.registerHelper('has', function (str, options) {
                  'use strict';
                  var patt = /(youtube|youtu.be)/g;
                  var match = patt.test(str);

                  if (match == null || match == false) {
                    return options.inverse(this);
                  } else {
                    return options.fn(this);
                  }
                });
                Handlebars.registerHelper('lengthequal', function (v1, v2, options) {
                'use strict';
                 if (v1.length==v2) {
                   return options.fn(this);
                }
                return options.inverse(this);
                });
                Handlebars.registerHelper('checklength', function (v1, v2, options) {
                'use strict';
                   if (v1.length>v2) {
                     return options.fn(this);
                  }
                  return options.inverse(this);
                });
                Handlebars.registerHelper('eachData', function(context, options) {
                  var fn = options.fn, inverse = options.inverse, ctx;
                  var ret = "";

                  if(context && context.length > 0) {
                    for(var i=0, j=context.length; i<j; i++) {
                      ctx = Object.create(context[i]);
                      ctx.index = i;
                      ret = ret + fn(ctx);
                    }
                  } else {
                    ret = inverse(this);
                  }
                  return ret;
                }); 
                Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
                    lvalue = parseFloat(lvalue);
                    rvalue = parseFloat(rvalue);

                    return {
                        "+": lvalue + rvalue
                    }[operator];
                });
                Handlebars.registerHelper('if_eq', function(a, b, opts) {
                    if(a == b) // Or === depending on your needs
                        return opts.fn(this);
                    else
                        return opts.inverse(this);
                });
                $.get('templates/med.html', function(template) {
                    var theTemplate = Handlebars.compile(template);
                    var rendered = theTemplate(allData);
                    $('#tableControler').html(rendered);
                });
                $.get('templates/modal.html', function(template) {
                    var theTemplate = Handlebars.compile(template);
                    var rendered = theTemplate(allData);
                    $('#rendermodais').html(rendered);
                });
            },
            filterChange: function() {
              $('#tableControl').hide();
              $('#genericSearch').keypress(function (e) {
                  if (e.which == '13') {
                      e.preventDefault();
                      $('#genericSearch').blur();
                      $('#filter-medicine').click();
                  }
              });
              $('#filter-medicine').click(function() {
                var selectedMedicine = $('#genericSearch').val();
                $('#tableControl').show();
                app.applyFilter(selectedMedicine);
              });
            },
            applyFilter: function(selectedMedicine) {
              var $medvisa = $('#tableControler').find('.medication');
              $medvisa.each(function(i, val) {
                var $medvisaData = $(this).data('medication');
                if ($medvisaData.indexOf(selectedMedicine) >= 0 || selectedMedicine === undefined) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            },
        };
        app.init();
    });
})(jQuery);