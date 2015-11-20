var express = require('express');
var app = express();

app.get('/chunk/:id', function (req, res) {
  var id = req.params.id;
  
  try{
    var rawJsonChunk = require("./WorldJson/WorldChunk" + id + ".json");
  }
  catch(err)
  {
    res.status(500).json({error: err})
  }
  var deltas = CreateBounds(rawJsonChunk.osm.bounds);
  var ways = CreateWays(rawJsonChunk.osm.node, rawJsonChunk.osm.way);
  res.send(ways);
});

var server = app.listen(9998, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

function CreateBounds (bounds)
{
 var deltaLon = Math.abs(bounds.maxlon - bounds.minlon);
 var deltaLat = Math.abs(bounds.maxlat - bounds.minlat);
 var deltas = {};
 deltas.lon = deltaLon;
 deltas.lat = deltaLat;
 return deltas
}

function CreateWays (nodes, ways)
{
  var outWays = [];
  for (var i in ways) {
      for (var j in ways[i].nd){
        var outWay = {};
        outWay.id = ways[i].id;
        outWay.points = [];
        for (var k in nodes){
          if(ways[i].nd[j].ref == nodes[k].id){
            var point = {};
            point.lat = nodes[k].lat;
            point.lon = nodes[k].lon;
            outWay.points.push(point);
          }
        }
        outWays.push(outWay);
      } 
    }

return outWays;
}

