angular.module('adminDashboard').controller('adminDashboardController', function (apiAdminDashboard) {
    const vm = this;
    vm.totalUser = 0;
    vm.percentRegisteredLastWeek = 0;
    vm.totalClinics = 0;

    const token = getCookieValue('api_auth_token');
    apiAdminDashboard.userReportAction(token).then(function(response) {
        const userReport = response.data.report;
        vm.totalUser = userReport.sum;
        vm.percentRegisteredLastWeek = (userReport.registeredSinceLastWeek / userReport.sum) * 100;

        // userStatusPieChart
        const xPieChart = ["Client", "Clinic Admin", "System Admin"];
        const yPieChart = [userReport.clientSum, userReport.clinicAdminSum, userReport.systemAdminSum];

        const layoutPieChart = {title:"User Role Distribution"};

        const dataPieChart = [{labels:xPieChart, values:yPieChart, type:"pie"}];

        Plotly.newPlot("userStatusPieChart", dataPieChart, layoutPieChart);
    }).catch(function(error) {

    })

    const params = {
        getClientAttendees: false,
    }
    apiAdminDashboard.getClinicsAction(params, token).then(function(response) {
        // const xHorizontalBarChart = [55, 49, 44, 24, 15];
        // const yHorizontalBarChart = ["Italy","France","Spain","USA","Argentina"];
        let xHorizontalBarChart = [];
        let yHorizontalBarChart = [];
        
        const clinics = response.data.clinics;
        vm.totalClinics = clinics.length;

        for(const clinic of clinics) {
            xHorizontalBarChart.push(clinic.clientAttendedIDs.length)
            yHorizontalBarChart.push(clinic.clinicName)
        }
 
        const dataHorizontalBarChart = [{
        x: xHorizontalBarChart,
        y: yHorizontalBarChart,
        type: "bar",
        orientation: "h",
        marker: {color:"rgba(255,0,0,0.6)"}
        }];

        const layoutHorizontalBarChart = {title:"Client Count by Clinic"};

        Plotly.newPlot("userPerClinicHorizontalBarChart", dataHorizontalBarChart, layoutHorizontalBarChart);
    }).catch(function(error){
        
    })
    

    // userPerClinicHorizontalBarChart

});