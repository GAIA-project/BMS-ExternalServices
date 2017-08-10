## BMS External Services

In this repo you can find services use can use in your project


### Energy Consumption Chart

The first service can be included in your project, using an iframe. It will show the energy consumption in a graphical chart for a specific building which runs under GAIA project.


```markdown
<iframe src="http://bms.gaia-project.eu/services/#/page/chart/{{building-id}}/{{SparkworksToken}}" width="1500" data-step="day|month|hour|5min" data-from="6/1/2016" data-to="8/1/2017" height="400" frameBorder="0"></iframe>
