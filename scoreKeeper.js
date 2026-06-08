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

    if (redScore > blueScore) {
        winnerOutput.style.color = 'rgb(204, 0, 0)';
        winnerOutput.style.background = 'rgba(182, 33, 33, 0.12)';
        winnerOutput.style.border = '1px solid rgba(182, 33, 33, 0.18)';
    } else if (blueScore > redScore) {
        winnerOutput.style.color = 'rgb(0, 0, 204)';
        winnerOutput.style.background = 'rgba(30, 94, 193, 0.12)';
        winnerOutput.style.border = '1px solid rgba(30, 94, 193, 0.18)';
    } else {
        winnerOutput.style.color = 'black';
        winnerOutput.style.background = 'var(--surface-muted)';
        winnerOutput.style.border = '1px solid var(--border)';
    }
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
            msg.innerHTML = '<span class="spinner-inline"></span>Loading match data...';
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

    // Attach event listeners after DOM is ready
    document.getElementById('redScore').addEventListener('input', updateWinnerField);
    document.getElementById('blueScore').addEventListener('input', updateWinnerField);
}

async function submitMatch() {
    const submitBtn = document.getElementById('submitMatch');
    const spinner = document.getElementById('submitSpinner');
    
    // Show spinner and disable button
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    const id = document.getElementById('matchId').value.trim();
    const type = document.getElementById('matchType').value.trim().toLowerCase();
    const red1 = document.getElementById('red1').value.trim();
    const red2 = document.getElementById('red2').value.trim();
    const blue1 = document.getElementById('blue1').value.trim();
    const blue2 = document.getElementById('blue2').value.trim();
    const redScore = document.getElementById('redScore').value;
    const blueScore = document.getElementById('blueScore').value;
    const redRP1 = document.getElementById('redRP1').checked;
    const redRP2 = document.getElementById('redRP2').checked;
    const redRP3 = document.getElementById('redRP3').checked;
    const blueRP1 = document.getElementById('blueRP1').checked;
    const blueRP2 = document.getElementById('blueRP2').checked;
    const blueRP3 = document.getElementById('blueRP3').checked;
    const winner = getWinnerFromScores(redScore, blueScore);

    const msg = document.getElementById('msg');
    //console.log("Post data === function" + (typeof postData === 'function'));
    //console.log("Update data === function" + (typeof updateData === 'function'));
    console.log("Current match === " + await getCurrentMatch());
    
    try {
        if (typeof postData === 'function' && await getCurrentMatch() == null) {
            var response = await postData(id, type, red1, red2, blue1, blue2, redScore, blueScore, redRP1, redRP2, redRP3, blueRP1, blueRP2, blueRP3, winner, getPasskey());
            msg.textContent = 'Match submitted';

            if (!response.success) {
                msg.textContent = `Error submitting match: ${response.error}`;
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                throw new Error(`Failed to submit match: ${response.error}`);
            }
            
        } else if (typeof updateData === 'function') {
            var response = await updateData(id, type, red1, red2, blue1, blue2, redScore, blueScore, redRP1, redRP2, redRP3, blueRP1, blueRP2, blueRP3, winner, getPasskey());
            msg.textContent = 'Match submitted';
            if (!response.success) {
                msg.textContent = `Error submitting match: ${response.error}`;
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                throw new Error(`Failed to submit match: ${response.error}`);
            }
            
        } else {
            msg.textContent = 'postData() / updateData() not available on this page.';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
        
        // Refresh match data after submission
        //initScoreKeeper();

        //Reload page after 1 second to update match list
        setTimeout(() => {
            location.reload();
        }, 1000);
    } catch (error) {
        spinner.style.display = 'none';
        submitBtn.disabled = false;
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', initScoreKeeper);
