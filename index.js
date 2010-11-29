$(function() {
  var setup = function() {
    var $body = $('body');
    $body.addClass('tabbed')

    $('head').append( $('<link />').attr( {
      rel : "stylesheet",
      href : "tabbed.css",
      type : "text/css",
    } ) );

    /** Add top level HTML/jQuery tabs **/

    // Begin by collecting the current body into a single root
    var $origroot = $('<div/>');
    $body.children().appendTo( $origroot );
    $body.append( $origroot );
  
    var $top = $("<div id='top'><ul></ul></div>");
    $body.prepend( $top );

    var $toptabs = $top.tabs( {
      tabTemplate: "<li><a href='#{href}'>#{label}</a></li>",
    } );

    // Callback to move the current body elements to the contents of a tab
    var moveBody = function( event, ui ) {
      $origroot.fadeOut( 'fast', function() {
        $(ui.panel).append( $origroot );
        $origroot.fadeIn( 'fast' );
      } );
    };
    $toptabs.bind( "tabsadd", moveBody );
    $toptabs.tabs("add", "#htmltab", "<acronym title='Hypertext Markup Language'>HTML</acronym>");
    $toptabs.unbind( "tabsadd", moveBody );

    var $root;
    $toptabs.tabs( {
      add: function( event, ui ) {
        $root = $(ui.panel);
      }
    } );
    $toptabs.tabs("add", "#jquerytab", "jQuery <acronym title='User Interface'>UI</acronym>");
  
    var $areas = $("<div id='areas'><ul></ul></div>");
    $root.append( $areas );
    var $topictabs = $areas.tabs( {
      tabTemplate: "<li><a href='#{href}'>#{label}</a></li>",
    } );

    //jQuery.getJSON( 'resume.json', function(data, textStatus, xhr) {
    // Runs on load to populate the initial tabs
    var tabcount = 0;
    $origroot.find('#toplist').children().each(function( idx, elem ) {
      var $src = $(elem);
      if( $src.children().hasClass( 'title' ) ) {
        function newTab() {
          $topictabs.tabs( {
            add: function( event, ui ) {
              buildTimeline( $src, $(ui.panel) );
            }
          } );
          var title = $src.children( '.title' ).text();
          $topictabs.tabs("add", "#tabs-" + ++tabcount, title);
        }
        setTimeout(newTab, 15 * idx);
      }
    } );

    console.log( $top.children( '.ui-tabs-nav' ).height() );
    $('#jquerytab').height( $(window).height() - $top.children( '.ui-tabs-nav' ).height() );

    function buildTimeline( $src, $root ) {
      //$src.children().clone().appendTo( $root );
      var $headlist = $('<ul id="headers"/>');
      var $proplist = $('<ul id="props"/>');
      $src.children().children( 'li' ).each( function( idx, elem ) {
        var $pitem = $('<li/>');
        $pitem.append( $(elem).children( 'ul' ).clone() );
        $proplist.append( $pitem );
        
        var $hitem = $('<li/>');
        $hitem.append( $(elem).children( '.org' ).clone() );
        $hitem.append( $(elem).children( '.role' ).clone() );
        $hitem.click( function() {
	  var offset = $pitem.offset().top;
	  $('#props').animate(
            {
	      scrollTop: offset
            },
            1000 );
	  console.log(offset);
        } );
      
        $headlist.append( $hitem );
      } );
      $root.append( $headlist );
      $root.append( $proplist );
    }
  }

    /* Load content via ajax if not inserted via php */
    function loadContent( data ) {
	$('body').append( $('<div/>' ).html( data ) );
	setup();
    }
    if( $('body').children().size() == 1 ) {
      try {
	  $.ajax( {
	      url: 'resume.html', 
	      success: function( data, status ) {
		  console.log( data );
		  if( data != '' ) {
		      loadContent( data )
		  } else {
		      $.get( 'https://github.com/wholcomb/resume/raw/master/resume.html',
			     loadContent )
		  }
	      },
	      error: function() {
		  // Not called on error: Origin null is not allowed by Access-Control-Allow-Origin.
	      },
	  } )
      } catch( e ) {
	  console.log( e.getMessage() );
      }
    } else {
	console.log($('body').children().size());
	setup();
    }
} );
  
