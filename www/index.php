<?php
	//include the RainTPL class
	include "inc/rain.tpl.class.php";

	raintpl::configure("base_url", null );
	raintpl::configure("tpl_dir", null );
//	raintpl::configure("cache_dir", "tmp/" );
	raintpl::configure("tpl_ext", "html" );

	//initialize a Rain TPL object
	$tpl = new RainTPL;
	$tpl->draw( 'template_home' );
?>

