'use strict';

angular.module('myApp.send', ['ngRoute'])


.controller('View2Ctrl', function($scope, $http) {
    if (window.localStorage.getItem("gitlab") == undefined) {
        window.location.href = "http://localhost:8000/auth.html";
    }
    if (window.localStorage.getItem("test") == undefined) {
        window.location.href = "#!/project";
    }
    $scope.goback = function () {
        window.location.href = "http://localhost:8000/#!/project";
    };
    $scope.count = 0;
    var tempdata2 = {};
    var tempdata = [];
    var JSON1 = JSON.parse(window.localStorage.getItem("test"));
    if (JSON1.data !== undefined) {
        for (var j in JSON1.data) {
            if (JSON1.data[j].type !== "project") {
                //alert(JSON1.data[j].text + " " + JSON1.data[j].parent + " "+ newid);
                $http.get("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/milestones/" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid + "/issues?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function (data) {
                    tempdata2 = data;
                }).then(function () {
                    for (var i in tempdata2.data) {
                        if (tempdata.includes(tempdata2.data[i].id)) {

                        }
                        else {
                            tempdata.push(tempdata2.data[i].id);
                        }

                    }
                });
            }
        }
    }
    else {
        window.location.href = "#!/project";
    }
    $scope.test1 = function () {
        document.getElementById('sendid').style.display = "none";
        document.getElementById('barid').style.display = "block";
        if (JSON.parse(window.localStorage.getItem("test2")).Milestonesid == null) {
            var mael = postmaels(JSON1, tempdata);
        }
        else {
            $scope.massiv = tempdata;
            editmiles(JSON1, tempdata);
        }
        var max = JSON1.data.length;
        $scope.percent = max;
        // $scope.perc = Math.round($scope.count*$scope.percent*100);
    };

    function postmaels(JSON1, mass) {
        var newid = "";
        var error = false;
        for (var i in JSON1.data) {
            if (error == false) {
                if (JSON1.data[i].type == "project") {
                    $http.post("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/milestones?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token + "&title=" + JSON1.data[i].text + " от " + Date().toString().split("GMT")[0] + "&start_date=" + JSON1.data[i].start_date + "&due_date=" + JSON1.data[i].end_date).then(function (data) {
                        newid = data.data.id;
                        $scope.textresp = newid;
                        $scope.count = $scope.count + 1;
                        $scope.perc = $scope.count / $scope.percent * 100;
                    }).then(function () {
                        for (var j in JSON1.data) {
                            if (JSON1.data[j].type !== "project") {
                                //alert(JSON1.data[j].text + " " + JSON1.data[j].parent + " "+ newid);
                                $http.post("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/issues?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token + "&title=" + JSON1.data[j].text + "&created_at=" + JSON1.data[j].start_date + "&due_date=" + JSON1.data[j].end_date + "&milestone_id=" + newid).then(function () {
                                    $scope.count = $scope.count + 1;
                                    $scope.perc = $scope.count / $scope.percent * 100;
                                    mass.push(JSON1.data[j].id);
                                }).then(function () {
                                    window.localStorage.removeItem("test2");
                                    window.localStorage.removeItem("test");
                                    window.localStorage.removeItem("test3");
                                });
                            }
                        }
                    })
                }
            }
            else {
                for (c in mass) {
                    $http.delete("https://gitlab.com/api/v3/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/issues/" + mass[c] + "?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function () {
                        $scope.count = $scope.count - 1;
                    });
                }
            }

        }
    }

    function editmiles(JSON1, mass) {
        var error = false;

        for (var i in JSON1.data) {
            if (JSON1.data[i].type == "project") {
                $http.put("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/milestones/" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid + "?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token + "&start_date=" + JSON1.data[i].start_date + "&due_date=" + JSON1.data[i].end_date).then(function (data) {
                    $scope.count = $scope.count + 1;
                    $scope.perc = $scope.count / $scope.percent * 100;
                }).then(function () {
                    for (var j in JSON1.data) {
                        if (error == false) {
                            if (JSON1.data[j].type !== "project") {

                                if (JSON1.data[j].type !== gantt.config.types.milestone) {

                                    if (JSON1.data[j].id !== 0) {
                                        mass.push(JSON1.data[j].id);
                                        JSON1.data[j].id = 0;
                                        $http.post("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/issues?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token + "&title=" + JSON1.data[j].text + "&created_at=" + JSON1.data[j].start_date + "&due_date=" + JSON1.data[j].end_date + "&milestone_id=" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid).then(function (data) {
                                            $scope.count = $scope.count + 1;
                                            $scope.perc = $scope.count / $scope.percent * 100;
                                            if (data.data.id == undefined) {
                                                error = true;
                                            }
                                        }).then(function () {

                                            window.localStorage.removeItem("test2");
                                            window.localStorage.removeItem("test");
                                            window.localStorage.removeItem("test3");

                                            //window.location.href = "#!/project";
                                        });
                                    }
                                }
                                else {
                                    if (JSON1.data[j].id !== 0) {
                                        $http.put("https://gitlab.com/api/v3/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/issues/" + JSON1.data[j].id + "?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token + "&title=" + JSON1.data[j].text + "&created_at=" + JSON1.data[j].start_date + "&due_date=" + JSON1.data[j].end_date + "&milestone_id=" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid).then(function () {
                                            $scope.count = $scope.count + 1;
                                            $scope.perc = $scope.count / $scope.percent * 100;
                                        }).then(function () {
                                            window.localStorage.removeItem("test2");
                                            window.localStorage.removeItem("test");
                                            window.localStorage.removeItem("test3");

                                            //window.location.href = "#!/project";
                                        }).then();

                                    }
                                }
                            }
                        }
                        else {
                            for (c in mass) {
                                $http.delete("https://gitlab.com/api/v3/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/issues/" + mass[c] + "?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function () {
                                    $scope.count = $scope.count - 1;
                                    $scope.perc = $scope.count / $scope.percent * 100;

                                }).then(function () {
                                    alert("ошибка загрузки");
                                    window.location.href = "#!/project";
                                });
                            }
                        }
                    }
                })
            }

        }

    }
});


//9ddf659675ee147ea7e297d5ee958b498a89c03add45155df4edb79a7989eaad
//eb50eb65ec223feb27cd94319a4f5e89c1c604e6e5f94897839f8c42308c1acb