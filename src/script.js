$ = jQuery;

(function($) {

    $(function() {

        // Inicia o Script e dispara 3 funcoes
        var app = {
            init: function() {
                app.initialScripts();
                app.retriveData();
                app.filterChange();
            },

            // o Script inicial ele vai esconder as tabs e criar a Dynamic tab de acordo com o que clica na navegacao
              // se for criar mais tabs ou remover e so seguir o nome da data-gentabs tem o mesmo nome da classe na aba
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

            //retrive data esta pegando o Json e transformando em objeto em seguida passando esse objeto para a outra funcao loadHydrogen
            retriveData: function() {
                $.getJSON('src/medicamentos.json').done(function(json) {
                    allData = json;
                    app.loadHydrogen(allData);
                });
            },


            loadHydrogen: function(allData) {

              // HELPERS do HANDLEBAR caso necessario.... Nao usei nenhum... se quiser remover (y) go ahead
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

                // FIM DOS HELPERS DO HANDLEBARS

                // Nessa funcao ele esta pegando o template med.html compilando com o Json que foi recebido no inicio do script
                  // E compilando transformando em um HTML com todos os dados
                  // Em seguida ele renderiza dentro do id tableControler

                $.get('templates/med.html', function(template) {
                    var theTemplate = Handlebars.compile(template);
                    var rendered = theTemplate(allData);
                    $('#tableControler').html(rendered);
                });

                // Nessa funcao ele esta pegando o template modal.html compilando com o Json que foi recebido no inicio do script
                  // E compilando transformando em um HTML com todos os dados
                  // Em seguida ele renderiza dentro do id rendermodais

                $.get('templates/modal.html', function(template) {
                    var theTemplate = Handlebars.compile(template);
                    var rendered = theTemplate(allData);
                    $('#rendermodais').html(rendered);
                });
            },

            // Funcao principal para pesquisa
              // esconde todo o conteudo 
            filterChange: function() {
              $('#tableControl').hide();

              // se o enter for pressionado ele ativa o click do botao de pesquisa
              $('#genericSearch').keypress(function (e) {
                  if (e.which == '13') {
                      e.preventDefault();
                      $('#genericSearch').blur();
                      $('#filter-medicine').click();
                  }
              });
              // quando o botao de pesquisa for clicado ele pega o valor do input e passa como parametro pra funcao applyFilter
              $('#filter-medicine').click(function() {
                var selectedMedicine = $('#genericSearch').val();
                $('#tableControl').show();
                app.applyFilter(selectedMedicine);
              });
            },

            // Recebe o valor do click
              // vai em cada data da tabela e tenta encontrar quem tem esse valor
                // quem nao tem o valor ele esconde... quem tem o valor ele mostra
            applyFilter: function(selectedMedicine) {
              var $medvisa = $('#tableControler').find('.medication');
              $medvisa.each(function(i, val) {
                var $medvisaData = $(this).data('medication');
                var $res = $medvisaData.toLowerCase();
                var sel = selectedMedicine.toLowerCase();
                if ($res.indexOf(sel) >= 0 || sel === undefined) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            },
        };

        // inicia o processo inteiro
        app.init();
    });
})(jQuery);