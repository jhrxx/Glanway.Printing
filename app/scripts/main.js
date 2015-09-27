/* jshint devel:true */
var boxList = [];
var textList = {};
$(function() {
    $('#paste').addClass('hide');
    $('#controls').addClass('disabled');
    var addBox = function(resizable) {
        if (typeof resizable === 'undefined') {
            resizable = true
        }
        var $box;
        $('#canvas').append($box = $('<div class="box ' + (resizable ? 'resizable' : 'fix-dimension') + '" id="box_' + boxList.length + '"><div class="box-content" id="box_content_' + boxList.length + '"></div><a class="close">x</a></div>'));
        // body...
        var box = interact('#box_' + boxList.length).draggable({
            onmove: function(event) {
                var target = event.target;
                if (!$(target).is('.box')) {
                    target = $(target).parents('.box')[0]
                }
                console.log(event);
                // keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                $('.box.active').removeClass('active');
                $(target).addClass('active');
                // translate the element
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        })
        if (resizable) {
            box.resizable({
                edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true
                }
            }).on('resizemove', function(event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);
                    $('.box.active').removeClass('active');
                $(target).addClass('active');
                // update the element's style
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                // target.textContent = event.rect.width + '×' + event.rect.height;
            });
        }
        $box.click(function() {
            $('.box.active').removeClass('active');
            $(this).addClass('active');
        });
        $('.close', $box).click(function(argument) {
            $(this).parent().remove()
        })
        boxList.push($box);
        return $box;
    },
    addText = function(text) {
        addBox();
        var $box = boxList[boxList.length - 1];
        var query = $('.box-content', $box).prop('id');
        var draw = SVG(query);
        // console.log(draw)
            // body...
        var text = draw.text(text)

        
        .fill($('#text_color').val())
        .font({
            // family: '宋体',
            size: $('#text_size').val()+'px'
        });
        textList[query] = text;
    }
    $('.color-picker-text').minicolors({
        control: $(this).attr('data-control') || 'hue',
        defaultValue: $(this).attr('data-defaultValue') || '',
        inline: $(this).attr('data-inline') === 'true',
        letterCase: $(this).attr('data-letterCase') || 'lowercase',
        opacity: $(this).attr('data-opacity'),
        position: $(this).attr('data-position') || 'bottom left',
        change: function(hex, opacity) {
            var color;
            try {
                color = hex ? hex : 'transparent';
                if (opacity) color += ', ' + opacity;
                // var size = parseInt($(this).val().trim());
                var $box = $('.box.active');
                // console.log(size)
                if ($box.length !== 0) {
                    var key = $('.box-content', $box).prop('id');
                    // console.log(key, textList[key])
                    textList[key].fill(color)
                }
            } catch (e) {}
        }
    });
    $('.color-picker-svg').minicolors({
        control: $(this).attr('data-control') || 'hue',
        defaultValue: $(this).attr('data-defaultValue') || '',
        inline: $(this).attr('data-inline') === 'true',
        letterCase: $(this).attr('data-letterCase') || 'lowercase',
        opacity: $(this).attr('data-opacity'),
        position: $(this).attr('data-position') || 'bottom left',
        change: function(hex, opacity) {
            var color;
            try {
                color = hex ? hex : 'transparent';
                if (opacity) color += ', ' + opacity;
                // var size = parseInt($(this).val().trim());
                var $box = $('.box.active');
                console.log($box)
                if ($box.length !== 0) {

                    $('svg', $box).css('fill', color)
                }
            } catch (e) {}
        }
    });
    // create canvas
    $('#create_canvas').click(function(argument) {
        // body...
        var l = parseInt($('#length').val()),
            w = parseInt($('#width').val()),
            h = parseInt($('#height').val());
        if (isNaN(l) || isNaN(h) || isNaN(w)) {
            alert('请输入数字')
            return;
        }
        var html = '<div class="grid-container">';
        for (var i = 0; i < 12; i++) {
            html += '<div class="box-area" style="width: ' + (i % 2 == 0 ? w : l) + 'px; height: ' + h + 'px"></div>'
        };
        html += '</div>';
        // console.log()
        $('#bg_grid').html(html).find('.grid-container').css({
            width: 2 * (w + l) + 2,
            height: 3 * h + 2
        });
        $('#paste').height(h - 10).css('top', h + 15).removeClass('hide').find('div').text('粘贴区');
        $('#controls').removeClass('disabled')
    });
    $('#reset_canvas').click(function(argument) {
        // body...
        if (window.confirm('所做修改的都会丢失，确定重置么？')) {
            window.location.reload();
        }
    })
    $('#create_box').click(function(argument) {
            // body...
            addBox();
        })
        // add text
    $('#add_text_btn').click(function(argument) {
        // body...
        var text = $('#text').val().trim();
        addText(text);
    })
    $('#text').on('keypress', function(event) {
        var text = $(this).val().trim();
        // body...
        if (event.which === 13) {
            addText(text);
        }
    });
    $('#text_size').change(function(argument) {
        console.log('onchange', textList)
            // body...
        var size = parseInt($(this).val().trim());
        var $box = $('.box.active');
        // console.log(size)
        if (!isNaN(size) || $box.length !== 0) {
            var key = $('.box-content', $box).prop('id');
            console.log(key, textList[key])
            textList[key].font({
                size: size + 'px'
            })
        }
    });
    // upload img 
    $('#upload_img_btn').click(function(argument) {
        // body...
        $('#upload_img').click();
    });
    $('#upload_img').change(function(argument) {
        addBox(false);
        var $box = boxList[boxList.length - 1];
        var query = $('.box-content', $box).prop('id');
        var imgPath = $(this).val();
        console.log(imgPath)
        console.log($(this)[0].files)
        var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
        // var image_holder = $("#image-holder");
        // image_holder.empty();
        if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
            if (typeof(FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function(e) {
                        console.log(e)
                        $("<img />", {
                            "src": e.target.result,
                            "class": "thumb-image"
                        }).appendTo($('.box-content', $box));
                    }
                    // image_holder.show();
                reader.readAsDataURL($(this)[0].files[0]);
            } else {
                alert("This browser does not support FileReader.");
            }
        } else {
            alert("请选择图片");
        }
    });

    $('.list li').click(function (argument) {
        // body...
        var $box = addBox();

        var query = $('.box-content', $box).html($(this).html());

    });

    $('#save').click(function (argument) {
        $('#output').html($('#canvas').html());
        $('#canvas').addClass('hide');
        var targetElem = $('#output');
        targetElem.find('.close').remove();
        targetElem.find('.box, .box-content').removeAttr('id');
        // var nodesToRecover = [];
        // var nodesToRemove = [];

        // // $('#output svg').each(function (argument) {
        // //     // $(this).remove()
        // // });

        var svgElem = targetElem.find('svg');
        svgElem.each(function(index, node) {
            var parentNode = node.parentNode;
            var svg = parentNode.innerHTML;

            var width = $(this).width();
            var height = $(this).height();
            $(parentNode).css({height:height, width: width});
            var canvas = document.createElement('canvas');
            // canvas.style.width = width;
            // canvas.style.width = height;
            canvg(canvas, svg);
            $(this).parent().empty();

            $(parentNode).html(canvas);
                
            canvas.setAttribute("style","width:"+width+"px");
            canvas.setAttribute("style","height:"+height+"px");
            // $(canvas).css({left: 0, top: 0, width:width, height:height});
            $(canvas).attr('width', width);
            $(canvas).attr('height', height);
            $(canvas).click();
        });
        setTimeout(function (argument) {
            
            html2canvas(document.getElementById('output'), {
              onrendered: function(canvas) {
                window.open(canvas.toDataURL());
                // console.log(canvas)
                // $('#main_content').addClass('hide');
                // $('#preview').removeClass('hide').append(canvas)
              }
            });  
        $('#canvas').removeClass('hide');

        },500)
    });

    $(window).click(function (e) {
       if($(e.target).parents('.box,aside').length === 0) {
        $('.box.active').removeClass('active');
       }
    });



});