// ==UserScript==
// @name       Message Grep
// @namespace    reddit.com/r/agentlame
// @description  enter something useful
// @include     http://www.reddit.com/user/PostsMRCquotes
// @version  1.0
// ==/UserScript==


function messagegrep() {
    
    // Don't mess with.
    var oneday = 86400000,        
        oneweek = 7*oneday,
        onemonth = 30*oneday,
        oneyear = 365*oneday,
        twoyears = 2*oneyear,
        loop = 0,
        now = new Date().getTime(),
        stop = false,
        modMineURL = '';
    
    ///// Settings ////////
    var page = 'moderator',  //Options: sent, inbox, messages, moderator
        subonly = 'atheism', // overrides 'page'.
        sender = '',
        receiver = '',
        contains = '',
        goto = now - twoyears;
    
    if (!subonly) {
        modMineURL = 'http://www.reddit.com/message/'+ page +'.json?count=100';
    } else {
        modMineURL = 'http://www.reddit.com/r/'+ subonly +'/about/message/inbox.json?count=100';
    }

    getSubs(modMineURL);

    function getSubs(URL) {
        $.getJSON(URL, function (json) {
            getPageResults(json.data.children, json.data.after);
        });
    }

    function getPageResults(things, after) {
        if (!after) {
            console.log('End of pages');
            return;
         }
        
        var found = 0;
        // check for author
        $.grep(things, function (t) {
            // Convert to a format we can use.
            var created = new Date(0);
            created.setUTCSeconds(t.data.created);
            created = created.getTime();
            
            if ((t.data.author || '').toLowerCase() === sender.toLowerCase() && (t.data.dest || '').toLowerCase() === receiver.toLowerCase()) {
                console.log('by: ' + t.data.author + ' to: ' + t.data.dest + ' about: ' + t.data.subject);
            }
            
            var body = (t.data.body || '').toLowerCase();
            
            if (contains && body.indexOf(contains.toLowerCase()) != -1) {
                console.log('contains: ' + contains);
                //console.log(t);
            }
            
            if (created < goto && !stop) {
                found++;
                
                if (found > 65) {
                    console.log('found: ' + new Date(created).toString()); 
                    stop = true;
                }
            }
        });
        
        loop++;
        if (!subonly) {
            console.log(loop + ': http://www.reddit.com/message/'+ page +'?before=' + after);
        } else {
            console.log(loop + ': http://www.reddit.com/r/'+ subonly +'/about/message/inbox?before=' + after);
        }
        
        if (!stop){ 
            var URL = modMineURL + '&after=' + after;
            getSubs(URL);
        }
    }
}

// Add scripts to page
(function () {
    
    // CSS
    var css = '\
		\\\
        ';

    // Add CSS.
    s = document.createElement('style');
    s.type = "text/css";
    s.textContent = css;
    document.head.appendChild(s);
    
    // Add settings
    var m = document.createElement('script');
    m.textContent = "(" + messagegrep.toString() + ')();';
    document.head.appendChild(m);

})();
