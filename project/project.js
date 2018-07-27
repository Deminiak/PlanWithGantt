'use strict';

angular.module('myApp.project', ['ngRoute'])


.controller('View3Ctrl', function($scope, $http) {
    //console.clear();
    if(window.localStorage.getItem("gitlab")==undefined)
    {
        window.location.href = "http://localhost:8000/auth.html";
    }

    $scope.loading = function()
    {
        if($scope.Projects == undefined)
        {
            //alert($scope.Projects);
            return false;
        }
        else
        {
            //alert($scope.Projects);
            return true;
        }
    };

    $scope.loaxdingwait = function()
    {
        if($scope.Milestones == undefined)
        {
            //alert($scope.Projects);
            return false;
        }
        else
        {
            //alert($scope.Projects);
            return true;
        }
    };


    $scope.Projectid = null;
    $scope.Milestonesid = null;
    $scope.MilestonesTitle = null;
    $scope.start_date = null;
    $http.get('https://gitlab.com/api/v4/user?access_token='+JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function (data) {
        $scope.MyUserData = data.data.id;
        $scope.MyUsername = data.data.name;
    }).then(function () {
        $http.get('https://gitlab.com/api/v4/users/'+$scope.MyUserData +'/projects?access_token='+JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token+"&state=active").then(function (data) {
            $scope.Projects = data.data;

        })
    }).then(function () {
        if($scope.Projectid !== null) {
            $http.get('https://gitlab.com/api/v4/projects/' + $scope.Projectid + '/milestones?access_token=' + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token+"&state=active").then(function (data) {
                $scope.Milestones = data.data;
            });
        }
    });
    $scope.changemile = function (){
        $scope.Milestones = undefined;
        $http.get('https://gitlab.com/api/v4/projects/'+$scope.Projectid+'/milestones?access_token='+JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token+"&state=active").then(function (data) {
            $scope.Milestones = data.data;
        });

    };
        $scope.setsetup1 = function () {
            $scope.setup = true;
            $scope.Milestonesid = null;
            $scope.MilestonesTitle = null;
            document.getElementById('milestone').style.display="none";
            document.getElementById('title').style.display="block";
        };
    $scope.setsetup2 = function () {
        $scope.setup = false;
        $scope.Milestonesid = null;
        $scope.MilestonesTitle = null;
        document.getElementById('milestone').style.display="block";
        document.getElementById('title').style.display="none";
    };

    $scope.senddata = function () {
        if($scope.Projectid !== null){
        var CatchData = {
            "Projectid": $scope.Projectid,
            "Milestonesid":$scope.Milestonesid,
            "MilestonesTitle":$scope.MilestonesTitle
        };
        window.localStorage.setItem("test2",JSON.stringify(CatchData));
            document.getElementById('cont').style.display="block";
        var tempdata2 = {};
        var Date_start =  new Date();
        var Date_end = "";
        var tempdata ={};
        if(JSON.parse(window.localStorage.getItem("test2")).Milestonesid !== null) {
            $http.get("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/milestones/" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid + "?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function (data) {
                Date_start = data.data.start_date;
                Date_end = data.data.due_date;
            }).then(function () {
                tempdata = {
                    data: [
                        {
                            "id": 1,
                            "text": "Название плана",
                            "type": gantt.config.types.project,
                            "duration": "",
                            open: true
                        }

                    ]
                };
            }).then(function () {
                if (JSON.parse(window.localStorage.getItem("test2")).Milestonesid !== null) {

                    $http.get("https://gitlab.com/api/v4/projects/" + JSON.parse(window.localStorage.getItem("test2")).Projectid + "/milestones/" + JSON.parse(window.localStorage.getItem("test2")).Milestonesid + "/issues?access_token=" + JSON.parse(window.localStorage.getItem("gitlab")).oauth.access_token).then(function (data) {
                        tempdata2 = data;
                    }).then(function () {
                        for (var i in tempdata2.data) {
                            var date_c = tempdata2.data[i].created_at.split('T')[0];
                            var date_d = tempdata2.data[i].due_date.split('T')[0];
                            tempdata.data.push({
                                "id": tempdata2.data[i].id,
                                "text": tempdata2.data[i].title,
                                "start_date": date_c,
                                "end_date": date_d,
                                "parent": 1,
                                "readonly": true,
                                "type": gantt.config.types.milestone
                            });
                            window.localStorage.setItem("test3", JSON.stringify(tempdata));
                        }
                    }).then(function () {
                        tempdata.data.sort(custom_sort);
                        window.localStorage.setItem("test3", JSON.stringify(tempdata));
                        window.location.reload();
                        window.location.href = "#!/diagram";


                    });

                }
                else
                {
                    window.location.reload();
                    window.location.href = "#!/diagram";
                }
            });
        }
    }
    else
        {
            alert("Поле проект обязательно для заполнения");
        }

    };
    function custom_sort(a, b) {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }



});

//9ddf659675ee147ea7e297d5ee958b498a89c03add45155df4edb79a7989eaad
//eb50eb65ec223feb27cd94319a4f5e89c1c604e6e5f94897839f8c42308c1acb