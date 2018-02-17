//Feld-Marker (Hinterlegt im Map.structre-Array und als CSS-Klassen in der main.css)
var marker = ["","active","warning"];

//Verfügbare GUI-Modes
var modes = ["view","edit","beacon"];

//Benachrichtigungen
var notifications = [
{title : "Schadstoff-Belastung", x : 10, y : 10, Source : "A0001"},
{title : "Defekt", x : 2, y : 8, Source : "A0001"},
{title : "Gang-Sperrung", x : 7, y : 8, Source : "A0001"},
{title : "Betriebs-Störung", x : 7, y : 2, Source : "A0001"}
];

//Alle hinterlegten Beacons
var beacons = [
{ID : "A0001", x : 6, y : 6},
{ID : "A0002", x : 3, y : 12}
];


//Nimmt ein Array an und gibt eine Bootstrap List-Group zurück
arrToListGroup = function(arr)
{
  var ret = $("<div/>").attr("class","list-group");

  $.each(arr,function(index,elem)
  {
    ret.append($("<a/>").attr("href","#").text(elem));
  });

  return ret;
}

//Allgemeine Einstellungen / Anzeigezustand
class Settings
{
  constructor()
  {
    //modes
    //0 = view
    //1 = Edit
    //2 = Beacon
    this.mode = 0;
  }

  //Aktualisiert die CSS-Klasse des Containers (=> Aktualisiert durch redraw die Event-Handler)
  update()
  {
    $(".container").attr("class","container "+modes[this.mode]);
    Room.redraw($(".container")); //Neu zeichnen, um Events zu aktualisieren
  }
}


//Verbindung zur Web-Api
//TODO: API anbinden
class webApi
{
  constructor(apikey)
  {
    this.apikey = apikey;
  }

  getAllBeacons()
  {
    return beacons;
  }

  getNotificationsForBeacon(ID)
  {
    return notifications;
  }

}


class Map
{
  constructor(name,structure) {
	this.name = name;
  this.structure = structure;
	}

  redraw(parent)
  {
    parent.html("");
    this.drawElement(parent);
  }

  drawElement(parent)
  {
    for(var h = 0;h<this.structure.length;h++)
    {
      var row = $("<div/>").attr("class","row mapRow");

      for(var w = 0;w<this.structure[0].length;w++)
      {
        var appendobj = $("<div/>").attr("data-h",h).attr("data-w",w).attr("class","col-1 mapCol "+marker[this.structure[h][w]]);


        if($("#cb_warning").prop("checked"))
        {
        //Prüfe, ob eine Notification für dieses Feld vorliegt
        $.each(notifications, function(index,elem){

            if(w == elem.x && h == elem.y)
            {
              //Füge das "Widget" mit Warnmeldung hinzu
              appendobj.append($("<div/>").attr("class","flag").html("<p><i class ='material-icons left'>warning</i></p>"+elem.title));
            }
        });
      }

      if($("#cb_beacons").prop("checked"))
      {
        //Prüfe, ob ein Beacon für dieses Feld vorliegt
        $.each(beacons, function(index,elem){
          if(w == elem.x && h == elem.y)
          {
          //Füge Beacon in das Div-Element ein
          appendobj.append($("<div/>").attr("class","beacon").html("<i class = 'material-icons'>network_wifi</i> "+elem.ID));
          }
        });
      }



        row.append(appendobj);
      }
      parent.append(row);
    }

    //Click-Eventhandler, falls der Bearbeitungsmodus (Einstellungen.mode == 1) aktiviert wurde
    $(".edit .mapCol").click(function(){
    Room.structure[parseFloat($(this).attr("data-h"))][parseFloat($(this).attr("data-w"))] = 1;
    $(".container").html("");
    Room.drawElement($(".container"));
    })
  }
}
