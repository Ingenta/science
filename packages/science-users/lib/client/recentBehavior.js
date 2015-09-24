Users.recent={
	/**
	 * 最近阅读
	 * 若不传入articleInfo，返回最近阅读列表，
	 * 若传入articleInfo，则将传入的article插入到数组索引0位置，若数组长度超过10，移除最末位的元素
	 * @param articleInfo
	 */
	read:function(articleInfo){
		if(articleInfo){
			var recentReadArr = Science.Cookies.getObj("recentRead") || [] ;
			var total=recentReadArr.length;

			if(total && recentReadArr[total-1]._id === articleInfo._id){
				return;
			}
			var obj = {
				_id:articleInfo._id,
				title:articleInfo.title
			};
			recentReadArr = _.union([obj],recentReadArr);
			if(recentReadArr.length>10){
				recentReadArr = _.initial(recentReadArr);
			}
			Science.Cookies.setObj("recentRead",recentReadArr);
			return recentReadArr;
		}else{
			return Science.Cookies.getObj("recentRead");
		}
	}
};