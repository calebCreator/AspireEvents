

async function getRankings(){
    const response = await getData2();
    const played = getPlayedMatches(response);
    const quals = getQualificationMatches(played);

    teams = getUniqueTeams(response);
    var rankings = [];
    for (team of teams){
        var rp = calculateTeamRP(team, quals);
        var score = calculateTeamAverageScore(team, quals);
        rankings.push([rankings.length + 1, team, rp, score, getTeamMatches(quals, team).length]);
    }

    //Sort rankings by RP, then by average score
    rankings.sort((a, b) => b[2] - a[2] || b[3] - a[3]);

    //Update rank based on sorted order
    for (var i = 0; i < rankings.length; i++){
        rankings[i][0] = i + 1;
    }

    console.log(rankings);

    //Hide loading message
    if(rankings.length === 0){
        document.getElementById("msg").innerHTML = "Rankings will be displayed here once qualification matches have been played.";
    }else{
        document.getElementById("msg").innerHTML = "";
    }


    return rankings;
}

//This function calculates the average RP per match for a team based on the matches they have played
function calculateTeamRP(team, matches){
    var rp = 0;
    const matchesPlayed = getTeamMatches(matches, team);
    for (match of matchesPlayed){
        rp += calculateMatchRP(match, team);
    }
    //Average RP per match
    rp = rp / matchesPlayed.length;

    if(matchesPlayed.length === 0){
        rp = 0;
    }
    return rp;
}

function calculateTeamAverageScore(team, matches){
    var score = 0;
    const matchesPlayed = getTeamMatches(matches, team);
    for (match of matchesPlayed){
        score += calculateMatchScore(match, team);
    }
    //Average score per match
    score = score / matchesPlayed.length;
    if(matchesPlayed.length === 0){
        score = 0;
    }
    return score;
}

function calculateMatchScore(match, team){
    var score = 0;

    if(match[2] === team || match[3] === team){
        //Red team
        score = parseInt(match[6]);
    }else if(match[4] === team || match[5] === team){
        //Blue team
        score = parseInt(match[7]);
    }else{
        //Team not in match
        score = 0;
    }
    return score;
}

//This function returns the matches that a team has played from the list of matches
function getTeamMatches(matches, team){
    var teamMatches = [];
    for (match of matches){
        //If team in match and match has been played (score not empty)
        if(match[2] === team || match[3] === team || match[4] === team || match[5] === team && match[6] !== ""){
            //Add match to team matches
            teamMatches.push(match);
        }
    }

    
    return teamMatches;
}

//This function is similar to getTeamMatches but is more flexible and checks if the team is included in the match instead of checking for an exact match. This allows it to work with team names that may have additional characters (e.g. "Team 123A" would be included in matches for "Team 123").
function getTeamMatchesFlex(matches, team){
    var teamMatches = [];
    for (match of matches){
        //If team in match and match has been played (score not empty)
        if(String(match[2]).startsWith(team) || String(match[3]).startsWith(team) || String(match[4]).startsWith(team) || String(match[5]).startsWith(team) && match[6] !== ""){
            //Add match to team matches
            teamMatches.push(match);
        }
    }
    return teamMatches;
}

function calculateMatchRP(match, team){
    var rp = 0;

    if(match[2] === team || match[3] === team){
        //Red team
        rp = match[8] + match[9] + match[10];

        if(match[14] === 'Red'){
            rp += 3;
        }else if(match[14] === 'Tie'){
            rp += 1;
        }
    }else if(match[4] === team || match[5] === team){
        //Blue team
        rp = match[11] + match[12] + match[13];
        if(match[14] === 'Blue'){
            rp += 3;
        }else if(match[14] === 'Tie'){
            rp += 1;
        }
    }else{
        //Team not in match
        rp = 0; 
    }
    return rp;
}

function getUniqueTeams(matches){
    var teams = [];

    //loop through all the matches
    for (match of matches){
        //Check each of the four teams in the match
        if(!teams.includes(match[2])){
            teams.push(match[2]);
        }
        if(!teams.includes(match[3])){
            teams.push(match[3]);
        }
        if(!teams.includes(match[4])){
            teams.push(match[4]);
        }
        if(!teams.includes(match[5])){
            teams.push(match[5]);
        }

    }
    return teams;
}

async function displayRankings(){
    var rankings = await getRankings();

    //Clear existing table data (except header)
    var table = document.getElementById('rankings');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (ranking of rankings){
        addData('rankings', ranking);
    }
}
