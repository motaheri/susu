<script type="text/javascript">
/*
	This little file tidies up the hideous overflowing Facebook links and unused social media boxes on the right of some pages.
	I could have gone rooting through a ton of pre-existing jQuery looking for where the contents of these boxes is set, 
	with no guarantee that I ever would, but life is too short.
	-PH
*/
$(document).ready(function()
{
	console.log("yup");
	$('.varsityLinkIcon a.msl_web').each(function(index) 
	{
		console.log("yupyup");
		var pattern = new RegExp('.*facebook.*');
		var hrefAttribute = $(this).attr('href');
		if (pattern.test(hrefAttribute))
		{
			$(this).html('Visit our Facebook page');
		}
	});

	$('.orgedit').each(function(index) 
	{
		var internalHTML = $(this).html();
		if ((internalHTML).length < 1)
		{
			$(this).css('display', 'none');
		}
	});
});
</script>