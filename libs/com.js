
export const escape2Html = (str) => {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', "#34": '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot|#34);/ig, function (all, t) { return arrEntities[t]; });
}
