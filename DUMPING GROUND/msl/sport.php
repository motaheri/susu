
<MSL:TemplateSnippet SnippetName="su-head-meta" />
<MSL:TemplateSnippet SnippetName="su-head-css-global" />
<MSL:TemplateSnippet SnippetName="su-head-js-global" />

{head_content}

       <MSL:TemplateSnippet SnippetName="su-content-navigation-logged-in" />
		<div id="cover" class="coverSocieties"></div>
        <div class="wrapper clearfix">
			<div id="aside">
				<ul class="nav nav-list">
					<li class="nav-header">Exec Committee</li>
					<li class="nav-exec">
						<img src="./img/activities/peopleBlank.jpg" />
						<div class="admin-people">
							<div>Ceinwen Cloney</div>
							<div>Societies and Services Officer</div>
						</div>
					</li>
					<li class="nav-exec">
						<img src="./img/activities/peopleBlank.jpg" />
						<div class="admin-people">
							<div>Rosie Hunnam</div>
							<div>Societies and Services Coordinator</div>
						</div>
					</li>
				</ul>
			</div>
			<div id="article">
				<article>
					<ul class="breadcrumb">
						<li><a href="#">Organisations</a></li>
						<li><a href="#">Societies</a></li>
					</ul>
					<h2 class="title">Societies</h2>
					<div class="content">
						<p>Swansea University Students' Union has over N societies. Get involved, meet new people and try new things. To find out more please click on the categories below and find a society.</p>
						<p>This will be a nice big intro text about how to join, what societies are, who to speak to and all that jazz. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.</p>
					</div>
				</article>
			</div>
        </div>
		
        <article class="wrapper clearfix">
			<div id="activitiesCategorySlider" class="activity-slider-group">
				<h2 class="title">Society Categories</h2>
				<div id="su-activitiesCat">
				</div>
			</div>
			<div id="activitiesListSlider" class="activity-slider-group">
				<h2 class="title" id="su-activitiesListHeader">Societies</h2>
				<div id="su-activitiesList">
				</div>
			</div>
			<div>
<!--				<h2 class="title">Documents</h2>
				<div class="content">
					<p>... list of documents and resources ...</p>
				</div>-->
			</div>
		</article>
		
        <MSL:TemplateSnippet SnippetName="su-content-footer" />
        <MSL:TemplateSnippet SnippetName="su-data-global" />
        <MSL:TemplateSnippet SnippetName="su-data-events" />
        <MSL:TemplateSnippet SnippetName="su-data-activities" />
		
		<script type="text/javascript">
			$(document).ready(function() {
				var activityType = "Societies";
				var firstCat = SU_Data.activitiesData.filter(function(d) { return d.Type == activityType; })[0].Category;
				SU_Widget.EventSlider_ActivitiesCategorySlider(activityType, "#su-activitiesCat");
				SU_Widget.EventSlider_ActivitiesListSlider(firstCat, "#su-activitiesList");
				$('#su-activitiesList').show();
			});
		</script>