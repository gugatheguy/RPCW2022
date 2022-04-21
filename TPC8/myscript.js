var id = ""
var editing = false
$(function(){
    $.get('http://localhost:7709/paras',function(data){
        data.forEach(p => {
            var edit = $(`<input class="w3-btn w3-round-large w3-teal w3-hover-grey" id="editbtn" type="button" value="Edit"/>`)
        //    var del = `<form action="/delete/${p._id}" method="POST">
        //    <button class="w3-button w3-round-large w3-teal w3-hover-red" type="submit">Delete</button>
        //</form>`
            $(edit).click(function() {
                id = p._id;
                editing = true;
                $("#formType").text("Editar parágrafo:");
                $("#botao1").val("Editar parágrafo");
                $("#campo").val(p.para);
            })
            var editDiv = $(`<div class="w3-cell"></div>`).append(edit).append("<br/>")
            var del = $(`<input class="w3-btn w3-round-large w3-teal w3-hover-red" id="delbtn" type="button" value="Delete"/>`)
            $(del).click(function() {
                $.ajax({
                    url: 'http://localhost:7709/paras/delete/' + p._id,
                    type: 'DELETE',
                    success: function(response) {
                        alert('Record removed: ' + JSON.stringify(p))
                        location.reload()
                    }
                });
            })
            var delDiv = $(`<div class="w3-cell"></div>`).append(del).append("<br/>")
            var elem = $(`<li class="w3-bar">
            <span class="w3-right">
                <div class="w3-cell-row">

                </div>
            </span>
            <div class="w3-bar-item">
                <span>${p.data} : ${p.para}</span>
            </div>
        </li>`)
            elem.children('span').children('div').append(editDiv).append(delDiv)
            $("#pars").append(elem);
        })
    })

    $("#botao1").click(function(){
        if (!editing){
            $.post('http://localhost:7709/paras',$("#paraForm").serialize())
            alert('Record inserted: ' + JSON.stringify($("#paraForm").serialize()))
            location.reload()
        }
        else{
            var data = $("#paraForm").serialize()
            data._id = id
            $.ajax({
                url: 'http://localhost:7709/paras/edit/'+id,
                type: 'PUT',
                data: data,
                success: function(response) {
                    alert('Record edited: ' + JSON.stringify($("#paraForm").serialize()));
                    editing = false;
                    $("#campo").val("Parágrafo");
                    location.reload();
                }
            });
        }
    })
})