$(function()
{
  $('.download').on('click', function()
  {
    var obj = $(this), version = obj.data('version'), link = obj.data('link'), os = obj.data('os');
    obj.text(v.downloading);
    $.ajax({
      type:"GET",
      url :createLink('client', 'download', 'version=' + version + '&link=' + link + '&os=' + os),
      timeout:0,
      dataType:"json",
      success:function(data)
      {
        if(data.result !== 'success')
        {
          obj.text(v.downloadFail);
          alert(data.message);
        }
        else
        {
          obj.text(v.downloadSuccess);
        }
      },
      error:function(jqXHR)
      {
        obj.text(v.downloadFail);
      }
    });
  });
});
