"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")
    ;

const DATE_FORMAT1 = "MMM D, YYYY"
    , DATE_FORMAT2 = "MMMM D"
    ;

var wordsToBold = ["PUBLIC"]

module.exports = function GitHubCalendar (container, username, options) {

    container = $(container);


    options = options || {};
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and <b>Public</b> commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`;


    if (options.global_stats === false) {
        container.style.minHeight = "175px";
    }

    // We need a proxy for CORS
    // Thanks, @izuzak (https://github.com/izuzak/urlreq)
    options.proxy = options.proxy || function (url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + url;
    };

    let fetchCalendar = () => fetch(options.proxy("https://github.com/" + username)).then(response => {
        return response.text()
    }).then(body => {
        let div = document.createElement("div");
        div.innerHTML = body;
        let cal = div.querySelector(".js-contribution-graph");
        cal.querySelector(".float-left.text-gray").innerHTML = options.summary_text;

        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
        if (cal.querySelector("include-fragment")) {
            setTimeout(fetchCalendar, 500);
        } 
        else {
            if (options.global_stats !== false) {
                let parsed = parse($("svg", cal).outerHTML)
                ,
                ;
                /*  , currentStreakInfo = parsed.current_streak
                                      ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT2)} – ${formatoid(parsed.current_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , longestStreakInfo = parsed.longest_streak
                                      ? `${formatoid(parsed.longest_streak_range[0], DATE_FORMAT2)} – ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , firstCol = $("<div>", {
                        "class": "contrib-column contrib-column-first table-column"
                      , html: `<span class="text-muted">Contributions in the last year</span>
                               <span class="contrib-number">${parsed.last_year} total</span>
                               <span class="text-muted">${formatoid(addSubtractDate.subtract(new Date(), 1, "year"), DATE_FORMAT1)} – ${formatoid(new Date(), DATE_FORMAT1)}</span>`
                    })
                  , secondCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Longest streak</span>
                               <span class="contrib-number">${parsed.longest_streak} days</span>
                               <span class="text-muted">${longestStreakInfo}</span>`
                    })
                  , thirdCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Current streak</span>
                               <span class="contrib-number">${parsed.current_streak} days</span>
                               <span class="text-muted">${currentStreakInfo}</span>`
                    })
                  ;

                cal.appendChild(firstCol);
                cal.appendChild(secondCol);
                cal.appendChild(thirdCol);
            */
            }

            container.innerHTML = cal.innerHTML;
        }
    }.catch(e => console.error(e));

    return fetchCalendar();
}

function makeBold(input, wordsToBold) {
    return input.replace(new RegExp('(\\b)(' + wordsToBold.join('|') + ')(\\b)','ig'), '$1<b>$2</b>$3');
}
