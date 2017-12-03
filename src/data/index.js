function initData(data, source) {
  var $data = observe(data);
  var $leafData = transformData(data);
  // var $watcher = watchData(data);

  // return {
  //   $data,
  //   $leafData
  //   // $watcher
  // };
  // return data;
  return {
    $data,
    $leafData
  }
}

