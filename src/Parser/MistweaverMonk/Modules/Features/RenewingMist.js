import Module from 'Parser/Core/Module';
import SPELLS from 'common/SPELLS';

const debug = false;

class RenewingMist extends Module {
  remApplyTimestamp = null;
  remRemoveTimestamp = null;
  remCastTimestamp = null;
  dancingMistProc = 0;
  remTicks = 0;
  castsREM = 0;

  on_initialize() {
    if(!this.owner.error) {
      this.active = this.selectedCombatant.traitsBySpellId[SPELLS.DANCING_MISTS.id] === 1;
    }
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      // Buffer time added to account for the buff being removed and replicating to a new target.  Testing 25 for now.
      if((event.timestamp - this.remRemoveTimestamp) <= 25 || this.remCastTimestamp === event.timestamp) {
        debug && console.log('REM Applied Ok. Timestamp: ' + event.timestamp);
      } else {
        debug && console.log('REM Applied without Cast / Jump. Timestamp: ' + event.timestamp);
        this.dancingMistProc++;
      }
      this.remApplyTimestamp = event.timestamp;
    }
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      this.remRemoveTimestamp = event.timestamp;
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST.id || spellId === SPELLS.LIFE_COCOON.id) {
      // Added because the buff application for REM can occur either before or after the cast.
      if(event.timestamp === this.remApplyTimestamp) {
        this.dancingMistProc--;
        debug && console.log('Dancing Mist Proc Removed / Timestamp: ' + event.timestamp);
      }
      this.castsREM++;
      this.remCastTimestamp = event.timestamp;
    }
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if(spellId === SPELLS.RENEWING_MIST_HEAL.id) {
      this.remTicks++;
    }
  }


  on_finished() {
    if(debug) {
      console.log('Dancing Mist Procs: ' + this.dancingMistProc);
      console.log('REM Ticks: ' + this.remTicks);
      console.log('REM Casts: ' + this.castsREM);
    }
  }
}

export default RenewingMist;
