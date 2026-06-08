/*******************************************************************************
Program Name: ASPIRE Match Schedule Generator
Pupose: To generate random, but even match schedules for teams

By: C Clark
Date: 05.15.2025
Version 1.0
********************************************************************************
*/

/* This program will create scedules that try to acheive the following:
1. Have time in between matches
2. Reduce number of times teams are paired together
3. Reduced number of times teams are against each other
4. Reduce the number of surrogates that a team has to play
5. Have the team play equally on red and blue
*/


//Global Variables


let totalMatches;
let teamData;
let rerun = true;

const ALLIANCES = ["red1", "red2", "blue1", "blue2"];

// Utility function to get random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//const ALLIANCES = ["red1", "blue1"]

//Main function to run the program
function makeFairSchedule(teams, totalMatches){
    //let teams  = getInfo();
    //teamData = createTeamData(teams);
    rerun = true;
    let schedule = [];
    while(rerun){
        schedule = generateSchedule(teams, totalMatches);
    }

    const surrogates = calculateSurrogates(schedule, teams);

    console.log("Schedule generated successfully!");
    //console.log(schedule);
    return { schedule, surrogates };
}


function getInfo(){
    //let teams = ["123", "231", "888", "118", "190"];
    //totalMatches = 14;
    
    //return teams;
    let teams = [];
    console.log("Please enter the teams that are competing.")
    while (true){
        let team = readLine("Enter a team # (\"e\" to exit): ");
        if(team == "e"){
            if(teams.length < ALLIANCES.length){
                console.log("You need at least 4 teams to compete.");
                continue;
            }
            break;
        }else if (team/1 == NaN){
            console.log("Please enter a valid team number including only numbers 0-9.");
            break;
        }else{
            teams.push(team);
        }
    }
    totalMatches = readInt("How many matches do you want to have in total?: ");
    if(totalMatches > 1000){
        totalMatches = 1000;
    }
    console.log("\n\n\n\n\n\n")
    return teams;
}
/*
function createTeamData(teams){
    let teamData = {};
    for(let team of teams){
        
        teamData[team] = {"inPrev": false, "alliancePartners": [], "oppoenents":[], "numSurr": 0, "timesRed": 0, "timesBlue": 0};
    }
    return teamData;
}*/

function genSchedule(matches, teamz){
    
    const TEAMS = teamz.slice();
    let teams = teamz.slice()
    let schedule = []
    for(let i =0; i < matches; i++){
        let teamsInMatch = [];
        //While you don't have enough teams
        while(teamsInMatch.length < ALLIANCES.length){
            //If there are teams that haven't played recently
            if(teams.length > 0){
                //Add one of them to the list
                let index = getRandomInt(0, teams.length - 1);
                teamsInMatch.push(teams[index]);
                //Mark down that they played a match
                teams.splice(index, 1);
            }else{
                //If all the teams have played
                teams = TEAMS.slice();
            }
        }
        
        //Add teh teams to the alliances randomly
        let match = {};
        for(let key of ALLIANCES){
            match[key] = "";
        }
        //console.log(ALLIANCES)
        //let match = {"red1": "", "red2": "", "blue1": "", "blue2": ""};
        
        
        for(let color of ALLIANCES/*["red1", "red2", "blue1", "blue2"]*/){
            let index = getRandomInt(0, teamsInMatch.length - 1);
            match[color] = teamsInMatch[index];
            teamsInMatch.splice(index, 1);
        }
        
        schedule.push(match);
    }
    rerun = false;
    return schedule;
}
/*
function generateRandomSchedule(matches, teamz){
    const TEAMS = teamz.slice();
    let teams = teamz.slice();
    let schedule = [];
    for(let i = 0; i < matches; i++){
        //Create emply match object
        let match = {"red1" : "", "red2" : "", "blue1": "", "blue2": ""};
        
        for(let color of ["red1", "red2", "blue1", "blue2"]){
            if(teams.length == 0){
                //Reset bc empty
                teams = TEAMS.slice();
            }
            
            
            let index = Randomizer.nextInt(0,teams.length -1);
            let team = teams[index];
            teams.remove(index);
            if(dictContains(match, team, ["red1", "red2", "blue1", "blue2"])){
                rerun = true;
                return [];
            }
            match[color] = team;
            
        }
        schedule.push(match);
        
    }
    rerun = false;
    return schedule;
}*/

function calculateSurrogates(schedule, teams){
    let counts = {};
    for(let team of teams){
        counts[team] = 0;
    }
    //console.log(counts)
    //console.log(schedule)
    for(let match of schedule){
        for(let color of ["red1", "red2", "blue1", "blue2"]){
            
            let team = match[color];
            
            counts[team] ++;
        }
    }
    
    
    //Find lowest
    let fewestMatches = 10000000000;
    for(let team of teams){
        if(counts[team] < fewestMatches){
            fewestMatches = counts[team];
        }
    }
    
    var surrogates = [];
    for(let team of teams){
        if(counts[team] > fewestMatches){
            //They have a surrogate
            //choose their surrogate
            let matcheee = 0;
            let matches = [];
            let i =0;
            //Create a list of the matches they are in 
            for(let match of schedule){
                i ++;
                if(dictContains(match, team, ["red1", "red2", "blue1", "blue2"])){
                    matches.push(i);
                }
            }
            //console.log(dictContains({"a": "1", "b": "2"}, "1", ["a", "b"]));
            //console.log(teams)
            matcheee = matches[getRandomInt(0, matches.length - 1)];
            console.log(team +  " has a surrogate match of match " + matcheee);
            surrogates.push([team, matcheee]);

        }
    }
    //console.log(counts);
    console.log("Each team will play " + fewestMatches + " matches.");

    return surrogates;
}

function dictContains(dict, item, keys){
    for(let key of keys){
        if(dict[key] == item){
            return true;
        }
    }
    return false;
}

function generateSchedule(teams, matches){
    //return generateRandomSchedule(matches, teams);
    return genSchedule(matches, teams);
    
    
    //Repeat the number of matches times
    /*let schedule = [];
    for(let i = 0; i < matches; i ++){
        schedule.push(newMatch(teams));
    }*/
    
    
}
/*
function newMatch(teams, schedule){
    //Check to find who hasn't played the previous match
    //for(let team of )
}*/

function printSchedule(schedule){
    if(ALLIANCES.length >3){
        console.log("   Red1  Red2  | Blue1  Blue2");
        let i = 0;
        for(let match of schedule){
            i ++;
            console.log(i + ". " + match["red1"] + " " + match["red2"] + " | " + match["blue1"] + " " + match["blue2"])
        }
    }else{
        console.log(" Red   | Blue  ");
        let i = 0;
        for(let match of schedule){
            i ++;
            console.log(i + ". " + match["red1"] + " | " + match["blue1"]);
        }
    }
}

//main();
