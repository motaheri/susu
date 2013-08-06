<?php
	//include the RainTPL class
	include "inc/rain.tpl.class.php";
	raintpl::configure("base_url", null );
	raintpl::configure("tpl_dir", null );
	raintpl::configure("tpl_ext", "html" );
	$tpl = new RainTPL;
?>
<html>
	<head>
		<?php $tpl->draw('snippet_meta'); ?>
		<?php $tpl->draw('snippet_head_css'); ?>
		<?php $tpl->draw('snippet_head_js'); ?>
	</head>
	<body>
		<div id="skin_su" class="page_testpagemike">
			<?php $tpl->draw('snippet_content_navigation'); ?>
			<div id="su_page_content">
				<?php $tpl->draw('snippet_content_coverflow'); ?>
				<!-- MSL CONTENT -->
				<?php $tpl->draw('snippet_content_news'); ?>
				<?php $tpl->draw('snippet_content_events'); ?>
				<?php $tpl->draw('snippet_content_blogs'); ?>
				<?php $tpl->draw('snippet_content_social'); ?>
			</div>
			<?php $tpl->draw('snippet_content_footer'); ?>
			<?php $tpl->draw('snippet_data_global'); ?>
			<?php $tpl->draw('snippet_data_events'); ?>
			<?php $tpl->draw('snippet_data_blogs'); ?>
			<?php $tpl->draw('snippet_data_news'); ?>
		</div>
	</body>
</html>