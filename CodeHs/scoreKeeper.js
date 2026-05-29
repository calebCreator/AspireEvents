function getWinnerFromScores(redScore, blueScore) {
    if (redScore > blueScore) return 'Red';
    if (blueScore > redScore) return 'Blue';
    return 'Tie';
}

function updateWinnerField() {
    const redScore = Number(document.getElementById('redScore').value);
    const blueScore = Number(document.getElementById('blueScore').value);
    const winnerOutput = document.getElementById('winnerOutput');
    winnerOutput.textContent = getWinnerFromScores(redScore, blueScore);
}

function setFieldValue(id, text) {
    const field = document.getElementById(id);
    if (!field) return;
    if ('value' in field) {
        field.value = text ?? '';
    } else {
        field.textContent = text ?? '';
    }
}

function populateMatchDetails(match) {
    if (!Array.isArray(match)) return;

    setFieldValue('matchId', match[0] ?? '');
    const type = (match[1] ?? '').toString().toLowerCase();
    setFieldValue('matchType', type);
    setFieldValue('red1', match[2] ?? '');
    setFieldValue('red2', match[3] ?? '');
    setFieldValue('blue1', match[4] ?? '');
    setFieldValue('blue2', match[5] ?? '');
}

async function initScoreKeeper() {
    if (typeof getCurrentMatch === 'function') {
        try {
            msg.textContent = 'Loading match data...';
            const currentMatch = await getCurrentMatch();
            if(currentMatch === null){
                document.getElementById("msg").innerHTML = "No current match found.";
                return;
            }
            populateMatchDetails(currentMatch);
            console.log('Current match loaded:', currentMatch);
            msg.textContent = 'Match Ready';
        } catch (error) {
            console.error('Error loading current match:', error);
        }
    }

    updateWinnerField();
}

function submitMatch() {
    const id = document.getElementById('matchId').value.trim();
    const type = document.getElementById('matchType').value.trim().toLowerCase();
    const red1 = document.getElementById('red1').value.trim();
    const red2 = document.getElementById('red2').value.trim();
    const blue1 = document.getElementById('blue1').value.trim();
    const blue2 = document.getElementById('blue2').value.trim();
    const redScore = Number(document.getElementById('redScore').value);
    const blueScore = Number(document.getElementById('blueScore').value);
    const redRP1 = document.getElementById('redRP1').checked;
    const redRP2 = document.getElementById('redRP2').checked;
    const redRP3 = document.getElementById('redRP3').checked;
    const blueRP1 = document.getElementById('blueRP1').checked;
    const blueRP2 = document.getElementById('blueRP2').checked;
    const blueRP3 = document.getElementById('blueRP3').checked;
    const winner = getWinnerFromScores(redScore, blueScore);

    const msg = document.getElementById('msg');
    if (typeof postData === 'function' && getCurrentMatch == null) {
        postData(id, type, red1, red2, blue1, blue2, redScore, blueScore, redRP1, redRP2, redRP3, blueRP1, blueRP2, blueRP3, winner);
        msg.textContent = 'Match submitted';
    } else if (typeof updateData === 'function') {
        updateData(id, type, red1, red2, blue1, blue2, redScore, blueScore, redRP1, redRP2, redRP3, blueRP1, blueRP2, blueRP3, winner);
        msg.textContent = 'Match submitted';
    } else {
        msg.textContent = 'postData() / updateData() not available on this page.';
    }
    
    // Refresh match data after submission
    //initScoreKeeper();

    //Reload page after 1 second to update match list
    setTimeout(() => {
        location.reload();
    }, 1000);
}

window.addEventListener('DOMContentLoaded', initScoreKeeper);

document.getElementById('redScore').addEventListener('input', updateWinnerField);
document.getElementById('blueScore').addEventListener('input', updateWinnerField);

updateWinnerField();
