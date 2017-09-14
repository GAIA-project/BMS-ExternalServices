## BMS External Services

In this repo you can find services use can use in your project


### Energy Consumption Chart

The first service can be included in your project, using an iframe. It will show the energy consumption in a graphical chart for a specific building which runs under GAIA project.


```markdown
<iframe src="http://bms.gaia-project.eu/services/#/page/chart/{{building-id}}/{{SparkworksToken}}/{{step}}/{{from}}/{{to}}" width="1500"  height="400" frameBorder="0"></iframe>

{{step}} can be day|month|hour|5min
{{from}} must be in 'd-m-YYYY' for example 6-1-2016 (that means January 6, 2016)
{{to}}  must be in 'd-m-YYYY' for example 6-1-2016 (that means January 6, 2016)
