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
		<div id="skin_su" class="page_ents page_event">
			<?php $tpl->draw('snippet_content_navigation'); ?>
			<div id="su_page_content">
				<div id="cover"></div>
				<div class="wrapper">
					
					<!-- MSL CONTENT -->
					<div id="article">
						<article>
							<h2 class="title">{event_name}</h2>
							<div class="content">
								<h3>Info</h3>
								{date} {time} at {location}
								<h3>Description</h3>
								{long_description}
							</div>
						</article>
					</div>
				</div>
			</div>
			<?php $tpl->draw('snippet_content_footer'); ?>
			<?php $tpl->draw('snippet_data_global'); ?>
			<?php $tpl->draw('snippet_data_events'); ?>
		</div>
	</body>
</html>