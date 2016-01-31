# TapTapBug
Bug catcher game using HTML, JavaScript and Canvas


function makeWhiteToTransparent(imgData){
	for (var i=0;i<imgData.data.length;i+=4)
	{
	    if(imgData.data[i+0]==0 && imgData.data[i+1]==0 && imgData.data[i+2]==0){
	    	imgData.data[i+3] = 0;
		}
	}
}
