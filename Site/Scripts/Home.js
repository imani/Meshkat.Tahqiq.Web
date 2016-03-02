$(document).ready(function () {
 
  $('.carousel').carousel({
      interval: 5000
  });
    
  //avoid drobdown to close
  $('li.dropdown.mega-dropdown a').on('click', function (event) {
      $(this).parent().toggleClass("open");
  });

  $('body').on('click', function (e) {
      if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
          $('li.dropdown.mega-dropdown').removeClass('open');
      }
  });

  
    //initialize tooltips on page
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
    
   
    //search when press Enter key on search input
    $(".query-input").keypress(function(e) {
        if (e.keyCode == 13) {
            location.href = "/CSearch/" + $(this).val();
        }
    });

    // clear signup form when signup modal hides
    $('.modal').on('hidden.bs.modal', function (e) {
        $("input").val("");
    });
});



function Login() {
    $("#loginError").hide();
    var l = Ladda.create(document.querySelector('#loginButton'));
    l.start();
    $.ajax({
        type: "POST",
        url: SSOServer+ "/token",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        data: { grant_type: 'password', client_id: 'MsktLib', UserName: $("#username").val(), Password: $("#password").val() },
        success:
            function (data) {
                createCookie("token", "Bearer " + data.access_token, 1);
                createCookie("username", $("#username").val(), 1);
                /*$.ajax({
                    type: "GET",
                    url: "/Home/GetIdentity",
                    dataType: "json",
                    contentType: "application/json",
                    headers: { Authorization: readCookie("token") },
                    success:
                        function (data) {*/
                            l.stop();
                            location.reload();
                        /*},
                    error: function (xhr, status, error) {
                        showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                        $("#loginError").show();
                    }
                });*/
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        }
    });
}

function Logout() {
    var l = Ladda.create(document.querySelector('#logout-button'));
    l.start();
    /*$.ajax({
        type: "GET",
        url: "/Home/logout" ,
        success:
            function (data) {*/
                eraseCookie("token")
                location.reload();
            /*},
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/x-www-form-urlencoded",
        cache: false
    });*/
}


function CheckServiceResultIsSuccess(result) {

    try {
        // serviceResult should not be null.
        var serviceResult = result;

        if (typeof serviceResult != 'object') {
            serviceResult = JSON.parse(result);
        }
        var serviceResponse = serviceResult.Response;
        if (serviceResult.Successful != null && serviceResult.Successful == false) {
            return false;
        }
    } catch (ex) {
        // do nothing. data is not service response.
    }
    return true;
}

//function for add new workspace

function addWorkspace() {
    var l = Ladda.create(document.querySelector('#btn-add-workspace'));
    l.start();
    var name = $("#txt-newWorkspace-name").val();
    if (name.length == 0) {
        $("#txt-newWorkspace-name").popover({ content: "نام نباید خالی باشد", placement: "left" }).popover('show');
        l.stop();
        return;
    }

    var privacyId = 2; // Default value for Private Workspaces
    if ($("#slt-workspace-privacy").length > 0)
        privacyId = $("#slt-workspace-privacy").val();
    $.ajax({
        type: "GET",
        url: "/Home/AddWorkspace",
        dataType: "json",
        data:{name: name, privacyId: privacyId},
        success:
            function (data) {
                l.stop();
                location.reload();
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}


//function for edit existing workspace

function editWorkspace(workspaceId) {
    var l = Ladda.create(document.querySelector('#btn-edit-workspace'));
    l.start();
    var name = $("#txt-workspace-name").val();
    var privacyId = $("#slt-workspace-privacy").val();
    $.ajax({
        type: "GET",
        url: "/Home/EditWorkspace",
        dataType: "json",
        data: { workspaceId: workspaceId, name: name, privacyId: privacyId },
        success:
            function (data) {
                l.stop();
                location.reload();
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}



function removeVolume(workspaceId, volumeId) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    $.blockUI(options);
    $.ajax({
        type: "GET",
        url: "/Workspace/RemoveVolume",
        data: { workspaceId: workspaceId, volumeId: volumeId },
        dataType: "json",
        success:
            function (data) {
                $.unblockUI();
                $("#" + volumeId).remove();
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}

function removeGraphModal(workspaceId, graphId) {
    $("#txtWorkspaceId").val(workspaceId);
    $("#txtGraphId").val(graphId);
    $("#remove-graph-modal").modal('show');
}

function removeGraph(workspaceId, graphId) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    $.blockUI(options);
    $.ajax({
        type: "GET",
        url: "/Workspace/RemoveGraph",
        data: {workspaceId: workspaceId, graphId: graphId},
        dataType: "json",
        success:
            function (data) {
                $.unblockUI();
                $("#" + graphId).remove();
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}

function AddContributors(workspaceId) {
    var l = Ladda.create(document.querySelector('#btn-add-contributor'));
    l.start();
    $("#add-person-modal").modal("toggle");
    var persons = $(".persons-select").select2("val");
    $.ajax({
        type: "GET",
        url: "/Workspace/AddContributors",
        dataType: "html",
        traditional: true,
        data: { workspaceId: workspaceId, personIds: persons },
        success:
            function (data) {
                l.stop();
                $("body").html(data);               
            },
        error: function (xhr, status, error) {
            $("#add-person-modal").modal("toggle");
            l.stop();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}

function removeContributor(workspaceId, personId) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    $.blockUI(options);
    $.ajax({
        type: "GET",
        url: "/Workspace/RemoveContributor",
        data: { workspaceId: workspaceId, personId: personId },
        dataType: "json",
        success:
            function (data) {
                $.unblockUI();
                $("#" + personId).remove();
            },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
            $("#loginError").show();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}
function AddVolumes(workspaceId, volumes) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    //$.blockUI(options);
    var l = Ladda.create(document.querySelector('#btn-add-volumes'));
    l.start();
    $("#add-volume-modal").modal("toggle");
    if (volumes === undefined) {
        volumes = $(".volumes-select").select2("val");
    }
    $.ajax({
        type: "GET",
        url: "/Workspace/AddVolumes",
        dataType: "json",
        traditional: true,
        headers: { Authorization: readCookie("token") },
        data: { workspaceId: workspaceId, volumeIds: volumes },
        success:
            function (data) {
                l.stop();
            },
        error: function (xhr, status, error) {
            $("#add-person-modal").modal("toggle");
            //$.unblockUI();
            l.stop();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}

function AddGraph(workspaceId) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    var l = Ladda.create(document.querySelector('#btn-add-graphs'));
    l.start();
    $.blockUI(options);
    $("#add-graph-modal").modal("toggle");
    var graphTitle = $(".graph-control").val();
    if (graphTitle.length == 0) {
        $(".graph-control").popover({ content: "نام نباید خالی باشد", placement: "left" }).popover('show');
        l.stop();
        return;
    }
    var offsetX = Math.round(window.innerWidth / 2);//$(document).width() / 2;
    var offsetY = Math.round(window.innerHeight / 2);//$(document).height() / 2;
    $.ajax({
        type: "GET",
        url: "/Workspace/AddGraph",
        dataType: "html",
        traditional: true,
        data: { workspaceId: workspaceId, GraphTitle: graphTitle, offsetX: offsetX, offsetY: offsetY},
        success:
            function (data) {
                l.stop();
                $.unblockUI();               
                $("body").html(data);
            },
        error: function (xhr, status, error) {
            $("#add-graph-modal").modal("toggle");
            l.stop();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });

    var GraphId = 0;
    $.ajax({
        type: "GET",
        url: "/Dynamic/Get",
        dataType: "json",
        data: { service: "Graph", action: "GetLastGraph", workspaceId: workspaceId },
        traditional: true,
        success:
            function (data) {
                console.log(data);
                GraphId = data;
            },
        error: function (xhr, status, error) {
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
    return GraphId;
}

function trySignup() {
    $("#signup-error").hide();
    var l = Ladda.create(document.querySelector('#btn-signup'));
    l.start();
    var username = $("#new-username").val();
    var email = $("#email").val();
    var password = $("#userPassword").val();
    var passwordConfirm = $("#password_confirmation").val();
    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    
    //validation
    if (!(username && email && password)) {
        $("#signup-error").show();
    }
    else if (password.length < 7) {
        $(".error-message").text("رمز عبور باید حداقل ۷ کاراکتر داشته باشد.");
        $("#signup-error").show();
    }
    else if (password != passwordConfirm) {
        $(".error-message").text("رمز عبور را یکسان وارد ننمودید.");
        $("#signup-error").show();
    } else if (emailRegex.test(email) != true) {
        $(".error-message").text("لطفا یک ایمیل معتبر وارد کنید.");
        $("#signup-error").show();
    }else {
        $.ajax({
            type: "POST",
            url: SSOServer+ "/Account/Register",
            dataType: "Json",
            crossOrigin: true,
            xhrFields: { withCredentials: true },
            data: JSON.stringify({ Username: username, Email: email, Password: password, ConfirmPassword: password }),
            success:
                function (data) {
                    console.log(data);
                    if (data.Successful) {
                        $(".error-message").text("خوش آمدید!");
                        $("#signup-error").removeClass("alert-danger").addClass("alert-success").show();
                        $("#username").val(username);
                        $("#password").val(password);
                        Login();
                    }
                    
                },
            error: function (xhr, status, error) {
                $(".error-message").text("خطا در ارتباط با سرور، لطفا بعدا دوباره تلاش کنید.");
                $("#signup-error").show();
            },
            contentType: "application/x-www-form-urlencoded"
        });
    }
    l.stop();
}

function tryChangePassword() {
    $("#changePasswordError").hide();
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmNewPassword = $("#confirmNewPassword").val();
    
    //clear inputs
    $("#oldPassword").val("");
    $("#newPassword").val("");
    $("#confirmNewPassword").val("");

    if (!(oldPassword && newPassword && confirmNewPassword)) {
        // show error for empty input
        $("#changePasswordError").show();
    } else if (newPassword != confirmNewPassword) {
        //show error of new password mismatch
        $(".error-message").text("رمز عبور را یکسان وارد ننمودید.");
        $("#changePasswordError").show();
    } else if (newPassword.length < 7) {
        $(".error-message").text("رمز عبور باید حداقل ۷ کاراکتر داشته باشد.");
        $("#changePasswordError").show();
    } else {
        $.ajax({
            type: "POST",
            url: SSOServer+ "/api/Account/ChangePassword",
            dataType: "Json",
            headers: { Authorization: readCookie("token") },
            data: JSON.stringify({
                UserName: readCookie("username"),
                OldPassword: oldPassword,
                NewPassword: newPassword,
                ConfirmPassword: newPassword
            }),
            success:
                function (data) {
                    if (data=="1") {
                        $(".error-message").text("رمز شما با موفقیت تغییر پیدا کرد");
                        $("#changePasswordError").removeClass("alert-danger").addClass("alert-success").show();
                    } else {
                        $(".error-message").text("رمز فعلی را اشتباه وارد کردید!");
                        $("#changePasswordError").show();
                    }

                },
            error: function (xhr, status, error) {
                $(".error-message").text("خطا در ارتباط با سرور، لطفا بعدا دوباره تلاش کنید.");
                $("#changePasswordError").show();
            },
            contentType: "application/json; charset=utf-8"
        });
    }
}

function loadProfile() {
    $.ajax({
        type: "GET",
        url: SSOServer + "/api/Account/GetPerson?Username=" + readCookie("username"),
        dataType: "Json",
        headers: { Authorization: readCookie("token") },
        success:
            function (data) {
                $("#name").val(data["fName"]);
                $("#lastName").val(data["lName"]);
                $("#address").val(data["address"]);
            },
        error: function (xhr, status, error) {
            $(".error-message").text("خطا در ارتباط با سرور، لطفا بعدا دوباره تلاش کنید.");
            $("#changePasswordError").show();
        }
    });
}

function editProfile(personId) {
    $("#editProfileError").hide();
    var person = {};
    person.PersonId = personId;
    person.PersonName = $("#name").val();
    person.PersonLastName = $("#lastName").val();
    person.PersonNationalCode = "";
    person.PersonAddress = $("#address").val();
    person.PersonIdentity = readCookie("username");

    var test = JSON.stringify({ person: {
        'PersonId': personId,
        'PersonName': $("#name").val(),
        'PersonLastName': $("#lastName").val(),
        'PersonNationalCode': null,
        'PersonIdentity': readCookie("username"),
        'PersonAddress': null
    } });
    
    if (!(person.PersonName && person.PersonLastName)) {
        // show error for empty input
        $("#editProfileError").show();
    } else {
        $.ajax({
            type: "POST",
            url: SSOServer+ "/api/Account/EditPerson",
            dataType: "Json",
            data: JSON.stringify( person ),
            headers: { Authorization: readCookie("token") },
            success:
                function (data) {
                    if (data.Successful) {
                        $(".error-message").text("تغییرات با موفقیت اعمال شد");
                        $("#editProfileError").removeClass("alert-danger").addClass("alert-success").show();
                        location.reload();
                    } else {
                        $(".error-message").text("مشکلی در اطلاعات وجود دارد. لطفا مجدد تلاش کنید.");
                        $("#editProfileError").show();
                    }

                },
            error: function (xhr, status, error) {
                $(".error-message").text("خطا در ارتباط با سرور، لطفا بعدا دوباره تلاش کنید.");
                $("#changePasswordError").show();
            },
            contentType: "application/json; charset=utf-8"
        });
    }
}
    
function tryRetPass(){
    $("#retPass-error").hide();
    var l = Ladda.create(document.querySelector('#btn-retPass'));
    l.start();
    var email = $("#retPassEmail").val();   
    var validator = $("#retPassValidator").val();
    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    //validation
    if (!(email)) {
        $("#retPass-error").show();
    }
    else if (validator != 14) {
        $(".error-message").text("عبارت امنیتی را صحیح وارد کنید.");
        $("#retPass-error").show();
    } else if (emailRegex.test(email) != true) {
        $(".error-message").text("لطفا یک ایمیل معتبر وارد کنید.");
        $("#retPass-error").show();
    } else {
        $.ajax({
            type: "GET",
            url: "/Account/RetrivePassword",
            dataType: "Json",
            data: { email: email },
            success:
                function (result) {
                    if (!result.Successful) {
                        $(".error-message").text(GetMessage(result.Response.Message));
                        $("#retPass-error").show();
                    } else {
                        $(".error-message").text("رمز جدید به ایمیل شما ارسال گردید!");
                        $("#retPass-error").removeClass("alert-danger").addClass("alert-success").show();
                    }
                    l.stop();
                },
            error: function(xhr, status, error) {                
                $(".error-message").text("خطا در ارتباط با سرور، لطفا بعدا دوباره تلاش کنید.");
                $("#retPass-error").show();
                l.stop();
            },
            contentType: "application/json; charset=utf-8"
        });
    }    
}

function getVolumeTags(volumeId) {
    if ($("#tag-cloud-" + volumeId + " > svg").length > 0)
        return;
    this.volumeId = volumeId;
    $("#tag-cloud-" + volumeId).append("<img src='/Site/Styles/images/ajax-loader.gif'>");
    var width = $("#tag-cloud-" + volumeId).closest(".tab-content").width();
    var height = Math.round(width * 0.52);
    $.ajax({
        type: "GET",
        url: "/BookTag/GetTagNames",
        dataType: "json",
        data: { workspaceId: -1, volumeId: volumeId},
        success: function (data) {
            //remove loader
            $("#tag-cloud-" + volumeId).html("");
            var keys = Object.keys(data);
            var len = keys.length > 100 ? 100 : keys.length;
            var wrd = [];
            
            for (var i = 0; i < len; i++) {
                wrd.push({ text: keys[i] /*.split('[')[0]*/, size: keys[i].match(/(\d+)/)[1] });
            };
            
            
            d3.layout.cloud().text(function (d) { return d.text; })
                .size([width, height])
                .words(wrd)
                .padding(5)
                .rotate(function () { return ~~(Math.random() * 2) * 90; })
                .font("b yekan")
                .fontSize(function (d) { return  Math.min(50, d.size); })
                .on("end", draw)
                .start();

            
        },
        error: function (xhr, status, error) {
            showMessage(error, messageList.ERROR, "error", xhr.status);
        },
        contentType: "application/x-www-form-urlencoded",
        cache: false
    });
    
    var fill = d3.scale.category20();
    
    function draw(words) {
        d3.select("#tag-cloud-" + window.volumeId).append("svg")
              .attr("width", width)
              .attr("height", height)
          .append("g")
            .attr("transform", "translate("+ width / 2 +","+ height/2 +")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function (d) { return Math.min(50, d.size) + "px"; })
            .style("font-family", "b yekan")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}

function showCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
}

function uploadImage(username) {
    var jcrop_api;
    data = new FormData();
    data.append("username", username);
    data.append("file", $("#profileImageUpload")[0].files[0]);
    $.ajax({
        url: '/Account/UploadPersonImage/',
        type: 'POST',
        dataType: 'json',
        contentType: false,
        processData: false,
        
        data: data,
        success: function (data) {
            $('#imageName').val(data.ReturnValue);
            $("#cropImageModal").modal();
            
            var cropTarget = $("#cropTarget");
            cropTarget.attr('src', "/Files/Images/" + data.ReturnValue).Jcrop({
                onSelect: showCoords,
                bgColor: 'black',
                bgOpacity: .4,
                setSelect: [100, 100, 50, 50],
                aspectRatio: 1
            }, function() {
                jcrop_api = this;
            });
            $("#cropImageModal").on('hidden.bs.modal', function() {
                jcrop_api.destroy();
            });

        }
    });
}

function showVolumeActivitiesChart(elementSelector) {
    if ($(elementSelector + " > svg").length > 0)
        return;
    var margin = { top: 20, right: 40, bottom: 30, left: 40 };
    var width = $(elementSelector).closest(".tab-content").width() - margin.left - margin.right;
    var height = Math.round(width * 0.52) - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var z = d3.scale.category20();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var stack = d3.layout.stack()
        .offset("zero")
        .values(function (d) { return d.values; })
        .x(function (d) { return d.date; })
        .y(function (d) { return d.value; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function (d) { return x(d.date); })
        .y0(function (d) { return y(d.y0); })
        .y1(function (d) { return y(d.y0 + d.y); });

    var svg = d3.select(elementSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [{ "key": "Group1", "values": [{ "key": "Group1", "value": 37, "date": "23" }, { "key": "Group1", "value": 32, "date": "24" }, { "key": "Group1", "value": 45, "date": "25" }, { "key": "Group1", "value": 24, "date": "26" }] }, { "key": "Group2", "values": [{ "key": "Group2", "value": 12, "date": "23" }, { "key": "Group2", "value": 19, "date": "24" }, { "key": "Group2", "value": 16, "date": "25" }, { "key": "Group2", "value": 52, "date": "26" }] }, { "key": "Group3", "values": [{ "key": "Group3", "value": 46, "date": "23" }, { "key": "Group3", "value": 42, "date": "24" }, { "key": "Group3", "value": 44, "date": "25" }, { "key": "Group3", "value": 64, "date": "26" }] }];
    var layers_data = stack(data);

    var elems = [];
    data.forEach(function (el) {
        elems = elems.concat(el.values);
    });

    x.domain(d3.extent(elems, function (d) { return d.date; }));
    y.domain([0, d3.max(elems, function (d) { return d.y0 + d.y; })]);

    var layers = svg.selectAll(".layer")
      .data(layers_data)
    .enter().append("g")
      .attr("class", "layer");
    layers.append("path")
    .attr("d", function (d) { return area(d.values); })
    .style("fill", function (d, i) { return z(i); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    layers.append("text")
      .attr("class", "group-label")
      .attr("x", 0)
      .attr("transform", function (d) {
          var point = d.values[d.values.length - 1];
          return "translate(" + x(point.date) + "," + y(point.y0 + point.y / 2) + ")";
      })
      .attr("dy", ".35em")
      .text(function (d) { return d.key; });
}

function showDateActivitiesChart(elementSelector, w, h) {
    var data = [{ "key": "Group1", "value": 37, "date": "1-May-12" }, { "key": "Group1", "value": 32, "date": "30-Apr-12" }, { "key": "Group1", "value": 45, "date": "27-Apr-12" }, { "key": "Group1", "value": 24, "date": "26-Apr-12" }];
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function (d) { return x(d.date); })
        .y0(height)
        .y1(function (d) { return y(d.value); });

    var svg = d3.select(elementSelector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.value; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("فعالیت‌ها");
}

function getComments(e, personId, volumeId, workspaceId) {
    //block ui jquery plugin options
    var options = {
        message: "<div><img src='/Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    $.blockUI(options);
    $.ajax({
        type: "GET",
        url: "/BookComment/GetComments",
        dataType: "html",
        traditional: true,
        data: { personId: personId, volumeId: volumeId, workspaceId: workspaceId, start:0, end:50 },
        success:
            function (data) {
                $.unblockUI();
                $(".comments-container").html(data);
                $(".list-group-item.active").removeClass("active");
                $(e.target).addClass("active");
            },
        error: function (xhr, status, error) {
            $("#add-graph-modal").modal("toggle");
            l.stop();
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}
