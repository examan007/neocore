define(["require", "exports"], function(require, exports){
   exports.getManager = function () {
        console.log("ContactManage.isDevice()=[" + ContactManager.isDevice() + ']');
        return (ContactManager);
   }
});
var ContactManager = {
    test: '1234',
    getController: function () {
        return (Contacts);
    },
    DeviceType: false,
    isDevice: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('DeviceType is set for device!')
            ContactManager.DeviceType = true;
        }
        return (ContactManager.DeviceType);
    },
    hideTooltips: function () {
        try {
            var HasTooltip = $('.hastooltip');
            HasTooltip.on('click', function(e) {
            e.preventDefault();
            var isShowing = $(this).data('isShowing');
            HasTooltip.removeData('isShowing');
            if (isShowing !== 'true')
            {
                HasTooltip.not(this).tooltip('hide');
                $(this).data('isShowing', "true");
                $(this).tooltip('show');
            }
            else
            {
                $(this).tooltip('hide');
            }
            }).tooltip({
            animation: true,
            trigger: 'manual'
            });
        } catch (e) {
            console.log('hideToolTips ' + e.toString());
        }
    },
    setToolTip: function () {
        if (ContactManager.DeviceType == false) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[rel=tooltip]').tooltip({ trigger: "hover" });
            ContactManager.hideTooltips();
        }
    }
}
