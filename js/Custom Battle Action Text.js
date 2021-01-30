//=============================================================================
// TDS Custom Battle Action Text
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_CustomBattleActionText = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.CustomBattleActionText = _TDS_.CustomBattleActionText || {};
//=============================================================================
 /*:
 * @plugindesc
 * This plugins allows you to set customized messages for actions.
 *
 * @author TDS
 */
//=============================================================================


//=============================================================================
// ** Window_BattleLog
//-----------------------------------------------------------------------------
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_displayAction         = Window_BattleLog.prototype.displayAction;
_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults  = Window_BattleLog.prototype.displayActionResults;
//=============================================================================
// * Make Custom Action Text
//=============================================================================
Window_BattleLog.prototype.makeCustomActionText = function(subject, target, item) {
  var user          = subject;
  var result        = target.result();
  var hit           = result.isHit();
  var success       = result.success;
  var critical      = result.critical;
  var missed        = result.missed;
  var evaded        = result.evaded;
  var hpDam         = result.hpDamage;
  var mpDam         = result.mpDamage;
  var tpDam         = result.tpDamage;
  var addedStates   = result.addedStates;
  var removedStates = result.removedStates;
  var strongHit     = result.elementStrong;
  var weakHit       = result.elementWeak;
  var text = '';
  var type = item.meta.BattleLogType.toUpperCase();
  var switches = $gameSwitches;
  var unitLowestIndex = target.friendsUnit().getLowestIndexMember();
  var pronome1 = target.name() === "AUBREY" ? "A" : "O";
  var pronome2 = target.name() === "AUBREY" ? "a" : "o";


  function parseNoEffectEmotion(tname, em) {
    if(em.toLowerCase().contains("afraid")) {
      if(tname === "OMORI") {return "OMORI não pode ficar amedrontado!\r\n"}
      return target.name() + " não pode ficar amedrontado!\r\n";
    }
    let finalString = `${tname} não pode ficar \r\n ${em}`;
    if(finalString.length >= 40) {
      let voinIndex = 0;
      for(let i = 40; i >= 0; i--) {
        if(finalString[i] === " ") {
          voinIndex = i;
          break;
        }
      }
      finalString = [finalString.slice(0, voinIndex).trim(), "\r\n", finalString.slice(voinIndex).trimLeft()].join('')
    }
    return finalString;
  }

  function parseNoStateChange(tname,stat,hl) {
    let noStateChangeText = `${stat} de ${tname} não pode ficar \r\nmais ${hl}`; // TARGET NAME - STAT - HIGHER/LOWER
    return noStateChangeText
  }

  // Type case
//OMORI//
if (hpDam != 0) {
  var hpDamageText = target.name() + ' levou ' + hpDam + ' de dano!';
  if (strongHit) {
    hpDamageText = '...Foi um ataque forte!\r\n' + hpDamageText;
  } else if (weakHit) {
    hpDamageText = '...Foi um ataque fraco.\r\n' + hpDamageText;
  }
} else if (result.isHit() === true) {
  var hpDamageText = 'O Ataque de ' + user.name() + '\r\n' + "não fez nada.";
} else {
  var hpDamageText = 'O Ataque de ' + user.name() + '\r\n' + "falhou!";
}

if (critical) {
    hpDamageText = 'ACERTOU BEM NO CORAÇÃO!\r\n' + hpDamageText;
}

if (mpDam > 0) {
  var mpDamageText = target.name() + ' perdeu ' + mpDam + ' de SUCO...';
  hpDamageText = hpDamageText + "\r\n" + mpDamageText;
} else {
  var mpDamageText = '';
}

  switch (type) {
  case 'BLANK': // ATTACK
    text = '...';
    break;

  case 'ATTACK': // ATTACK
    text = user.name() + ' atacou ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'MULTIHIT':
    text = user.name() + "fez um ataque dinâmico!\r\n";
    break;

  case 'OBSERVE': // OBSERVE
    text = user.name() + ' focou sua visão e observou.\r\n';
    text += target.name() + '!';
    break;

  case 'OBSERVE TARGET': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = target.name() + ' está de olho no\r\n';
    text += user.name() + '!';
    break;

  case 'OBSERVE ALL': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = user.name() + ' focou sua visão e observou.\r\n';
    text += target.name() + '!';
    text = target.name() + ' está de olho em todo mundo!';
    break;

  case 'SAD POEM':  // SAD POEM
    text = user.name() + ' leu um poema triste.\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(12)) {text += target.name() + ' se sentiu MISERÁVEL...';}
      else if(target.isStateAffected(11)) {text += target.name() + ` se sentiu DEPRIMID${pronome1} ..`;}
      else if(target.isStateAffected(10)) {text += target.name() + ' se sentiu TRISTE.';}
    }
    else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!")}
    break;

  case 'STAB': // STAB
    text = user.name() + ' esfaqueou ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'TRICK':  // TRICK
    text = user.name() + ' enganou ' + target.name() + '.\r\n';
    if(target.isEmotionAffected("happy")) {
      if(!target._noStateMessage) {text += target.name() + ' perder VELOCIDADE!\r\n';}
      else {text += parseNoStateChange(target.name(), "VELOCIDADE ", "diminuiu!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'SHUN': // SHUN
    text = user.name() + ' ignorou ' + target.name() + '.\r\n';
    if(target.isEmotionAffected("sad")) {
      if(!target._noStateMessage) {text += target.name() + ' perdeu DEFESA.\r\n';}
      else {text += parseNoStateChange(target.name(), "DEFESA ", "diminuiu!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'MOCK': // MOCK
    text = user.name() + ' provocou ' + target.name() + '.\r\n';
    text += hpDamageText;
    break;

  case 'HACKAWAY':  // Hack Away
    text = user.name() + ' açoitou com sua faca loucamente!';
    break;

  case 'PICK POCKET': //Pick Pocket
    text = user.name() + ' tentou pegar um item!\r\n';
    text += 'do ' + target.name();
    break;

  case 'BREAD SLICE': //Bread Slice
    text = user.name() + ' fatiou ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HIDE': // Hide
    text = user.name() + ' desaparece no fundo... ';
    break;

  case 'QUICK ATTACK': // Quick Attack
    text = user.name() + ' deu uma investida no ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT HAPPY': //Exploit Happy
    text = user.name() + ' se APROVEITOU da ';
    text += 'FELICIDADE do \r\n' + target.name() + '\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT SAD': // Exploit Sad
    text = user.name() + ' se APROVEITOU da ';
    text += 'TRISTEZA do \r\n' + target.name() + '\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT ANGRY': // Exploit Angry
    text = user.name() + ' se APROVEITOU da ';
    text += 'RAIVA do \r\n' + target.name() + '\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT EMOTION': // Exploit Emotion
    text = user.name() + " se APROVEITOU das EMOÇÕES do " + target.name();
    if(text.length >= 34) {
      text = user.name() + ' se APROVEITOU do ' + target.name() + ' e suas \r\n';
      text += 'EMOÇÕES!\r\n';
    }
    else {text += "\r\n"}
    text += hpDamageText;
    break;

  case 'FINAL STRIKE': // Final Strike
    text = user.name() + ' lançou seu ATAQUE ESPECIAL!';
    break;

  case 'TRUTH': // PAINFUL TRUTH
    text = user.name() + ' sussurrou algo para o\r\n';
    text += target.name() + '.\r\n';
    text += hpDamageText + "\r\n";
    if(!target._noEffectMessage) {
      text += target.name() + " se sentiu TRISTE.\r\n";
    }
    else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!\r\n")}
    if(user.isStateAffected(12)) {text += user.name() + " se sentiu MISERÁVEL...";}
    else if(user.isStateAffected(11)) {text += user.name() + ` se sentiu DEPRIMID${pronome1} ..`;}
    else if(user.isStateAffected(10)) {text += user.name() + " se sentiu TRISTE.";}
    break;

  case 'ATTACK AGAIN':  // ATTACK AGAIN 2
    text = user.name() + ' ataca novamente!\r\n';
    text += hpDamageText;
    break;

  case 'TRIP':  // TRIP
    text = user.name() + ' derrubou ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + ' perdeu VELOCIDADE!\r\n';}
    else {text += parseNoStateChange(target.name(), "VELOCIDADE", "diminuiu!\r\n")}
    text += hpDamageText;
    break;

    case 'TRIP 2':  // TRIP 2
      text = user.name() + ' derrubou ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' perdeu VELOCIDADE!\r\n';}
      else {text += parseNoStateChange(target.name(), "VELOCIDADE", "diminuiu!\r\n")}
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu TRISTE.\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!\r\n")}
      text += hpDamageText;
      break;

  case 'STARE': // STARE
    text = user.name() + ' encarou ' + target.name() + '.\r\n';
    text += target.name() + ' se sentiu descofortável.';
    break;

  case 'RELEASE ENERGY':  // RELEASE ENERGY
    text = user.name() + ' e seus amigos se juntam e\r\n';
    text += 'lançam seu ATAQUE ESPECIAL!';
    break;

  case 'VERTIGO': // OMORI VERTIGO
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' desequilibrou todos os inimigos!\r\n';
      text += 'O ATAQUE de todos os inimigos caiu!\r\n';
    }
    text += hpDamageText;
    break;

  case 'CRIPPLE': // OMORI CRIPPLE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' aleijou todos os inimigos!\r\n';
      text += "A VELOCIDADE de todos os inimigos caiu.\r\n";
    }
    text += hpDamageText;
    break;

  case 'SUFFOCATE': // OMORI SUFFOCATE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' sufocou todos os inimigos!\r\n';
      text += 'Todos os inimigos sentiram falta de ar.\r\n';
      text += "A DEFESA de todos os inimigos caiu.\r\n";
    }
    text += hpDamageText;
    break;

  //AUBREY//
  case 'PEP TALK':  // PEP TALK
    text = user.name() + ' animou ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ` se sentiu MANÍAC${pronome1} ..`;}
      else if(target.isStateAffected(7)) {text += target.name() + ` se sentiu EXTÁTIC${pronome1} ..`;}
      else if(target.isStateAffected(6)) {text += target.name() + ' se sentiu ALEGRE!';}
    }
    else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!")}
    break;

  case 'TEAM SPIRIT':  // TEAM SPIRITZ
    text = user.name() + ' animou ' + target.name() + '!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ` se sentiu MANÍAC${pronome1}!!!\r\n`;}
      else if(target.isStateAffected(7)) {text += target.name() + ` se sentiu EXTÁTIC${pronome1}!!\r\n`;}
      else if(target.isStateAffected(6)) {text += target.name() + ' se sentiu ALEGRE!\r\n';}
    }
    else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!\r\n")}

    if(!user._noEffectMessage) {
      if(user.isStateAffected(8)) {text += user.name() + ` se sentiu MANÍAC${pronome1}!!!`;}
      else if(user.isStateAffected(7)) {text += user.name() + ` se sentiu EXTÁTIC${pronome1}!!`;}
      else if(user.isStateAffected(6)) {text += user.name() + ' se sentiu ALEGRE!';}
    }
    else {text += parseNoEffectEmotion(user.name(), "mais FELIZ!\r\n")}
    break;

  case 'HEADBUTT':  // HEADBUTT
    text = user.name() + ' deu uma cabeçada em ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  case 'HOMERUN': // Homerun
    text = user.name() + ' bate o ' + target.name() + '\r\n';
    text += 'para fora do parque!\r\n';
    text += hpDamageText;
    break;

  case 'THROW': // Wind-up Throw
    text = user.name() + ' atira sua arma!';
    break;

  case 'POWER HIT': //Power Hit
    text = user.name() + ' esmaga ' + target.name() + '!\r\n';
    if(!target._noStateMessage) {text += target.name() + ' perdeu DEFESA.\r\n';}
    else {text += parseNoStateChange(target.name(), "DEFESA", "diminuiu!\r\n")}
    text += hpDamageText;
    break;

  case 'LAST RESORT': // Last Resort
    text = user.name() + ' acerta ' + target.name() + '\r\n';
    text += 'com toda sua força!\r\n';
    text += hpDamageText;
    break;

  case 'COUNTER ATTACK': // Counter Attack
    text = user.name() + ' prepara seu taco!';
    break;

  case 'COUNTER HEADBUTT': // Counter Headbutt
    text = user.name() + ' prepara sua cabeçada!';
    break;

  case 'COUNTER ANGRY': //Counter Angry
    text = user.name() + ' se prepara!';
    break;

  case 'LOOK OMORI 1':  // Look at Omori 2
    text = 'OMORI não notou ' + user.name() + ', então\r\n';
    text += user.name() + ' ataca novamente!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 2': // Look at Omori 2
    text = 'OMORI ainda não notou ' + user.name() + ', então\r\n';
    text += user.name() + ' ataca mais forte!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 3': // Look at Omori 3
    text = 'OMORI finalmente notou ' + user.name() + '!\r\n';
    text += user.name() + ' balança seu taco alegremente!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK KEL 1':  // Look at Kel 1
    text = 'KEL enche o saco da AUBREY!\r\n';
    text += target.name() + " se sentiu NERVOSA!";
    break;

  case 'LOOK KEL 2': // Look at Kel 2
   text = 'KEL enche o saco da AUBREY!\r\n';
   text += 'ATAQUE do KEL e AUBREY aumenta!\r\n';
   var AUBREY = $gameActors.actor(2);
   var KEL = $gameActors.actor(3);
   if(AUBREY.isStateAffected(14) && KEL.isStateAffected(14)) {text += 'KEL e AUBREY se sentem NERVOSOS!';}
   else if(AUBREY.isStateAffected(14) && KEL.isStateAffected(15)) {
    text += 'KEL se sentiu ENFURECIDO!!\r\n';
    text += 'AUBREY se sentiu NERVOSA!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(14)) {
    text += 'KEL se sentiu NERVOSO!\r\n';
    text += 'AUBREY se sentiu ENFURECIDA!!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(15)) {text += 'KEL e AUBREY se sentem ENFURECIDOS!!';}
   else {text += 'KEL e AUBREY se sentem NERVOSOS!';}
   break;

  case 'LOOK HERO':  // LOOK AT HERO 1
    text = 'HERO diz para AUBREY focar!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " se sentiu FELIZ!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " se sentiu EXTÁTICA!!\r\n"}
    text += user.name() + ' ganhou DEFESA!!';
    break;

  case 'LOOK HERO 2': // LOOK AT HERO 2
    text = 'HERO alegra AUBREY!\r\n';
    text += 'A DEFESA da AUBREY aumentou!!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " se sentiu FELIZ!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " se sentiu EXTÁTICA!!\r\n"}
    if(!!$gameTemp._statsState[0]) {
      var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
      if(absHp > 0) {text += `AUBREY recupera ${absHp} de CORAÇÃO!\r\n`;}
    }
    if(!!$gameTemp._statsState[1]) {
      var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
      if(absMp > 0) {text += `AUBREY recupera ${absMp} de SUCO...`;}
    }
    $gameTemp._statsState = undefined;
    break;

  case 'TWIRL': // ATTACK
    text = user.name() + ' ataca ' + target.name() + '!\r\n';
    text += hpDamageText;
    break;

  //KEL//
    case 'ANNOY':  // ANNOY
      text = user.name() + ' irritou ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(14)) {text += target.name() + ` se sentiu NERVOS${pronome1} ..`;}
        else if(target.isStateAffected(15)) {text += target.name() + ` se sentiu ENFURECID${pronome1} ..`;}
        else if(target.isStateAffected(16)) {text += target.name() + ` se sentiu FURIOS${pronome1} ..`;}
      }
      else {text += parseNoEffectEmotion(target.name(), "mais NERVOSO!")}
      break;

    case 'REBOUND':  // REBOUND
      text = 'A bola de' + user.name() + 'ricocheteia para todo lado!';
      break;

    case 'FLEX':  // FLEX
      text = user.name() + ' flexiona e se sente fortão!\r\n';
      text += user.name() + " ganhou TAXA DE ACERTO!\r\n"
      break;

    case 'JUICE ME': // JUICE ME
      text = user.name() + ' passa o COCO para ' + target.name() + '!\r\n'
      var absMp = Math.abs(mpDam);
      if(absMp > 0) {
        text += `${target.name()} recupera ${absMp} de SUCO...\r\n`
      }
      text += hpDamageText;
      break;

    case 'RALLY': // RALLY
      text = user.name() + ' deixa todo mundo empolgado!\r\n';
      if(user.isStateAffected(7)) {text += user.name() + ` se sentiu EXTÁTIC${pronome1}\r\n`}
      else if(user.isStateAffected(6)) {text += user.name() + " se sentiu FELIZ!\r\n"}
      text += "Todo mundo ganhou ENERGIA!\r\n"
      for(let actor of $gameParty.members()) {
        if(actor.name() === "KEL") {continue;}
        var result = actor.result();
        if(result.mpDamage >= 0) {continue;}
        var absMp = Math.abs(result.mpDamage);
        text += `${actor.name()} recuperou ${absMp} de SUCO...\r\n`
      }
      break;

    case 'SNOWBALL': // SNOWBALL
      text = user.name() + ' jogou uma bola de neve em\r\n';
      text += target.name() + '!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " se sentiu TRISTE.\r\n"}
      else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!\r\n")}
      text += hpDamageText;
      break;

    case 'TICKLE': // TICKLE
      text = user.name() + ' fez cócegas em ' + target.name() + '!\r\n'
      text += `${target.name()} baixou a guarda!`
      break;

    case 'RICOCHET': // RICOCHET
     text = user.name() + ' faz um truque extravagante com a bola!\r\n';
     text += hpDamageText;
     break;

    case 'CURVEBALL': // CURVEBALL
     text = user.name() + ' joga uma bola curva...\r\n';
     text += target.name() + ' é jogado em um loop.\r\n';
     switch($gameTemp._randomState) {
       case 6:
         if(!target._noEffectMessage) {text += target.name() + " se sentiu FELIZ!\r\n"}
         else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!\r\n")}
         break;
      case 14:
        if(!target._noEffectMessage) {text += target.name() + " se sentiu NERVOSO!\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "mais NERVOSO!\r\n")}
        break;
      case 10:
        if(!target._noEffectMessage) {text += target.name() + " se sentiu TRISTE.\r\n"}
        else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!\r\n")}
        break;

     }
     text += hpDamageText;
     break;

    case 'MEGAPHONE': // MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = user.name() + ' corre por aí irritando todo mundo!\r\n';}
      if(target.isStateAffected(16)) {text += target.name() + ' se sentiu FURIOSO!!!\r\n'}
      else if(target.isStateAffected(15)) {text += target.name() + ' se sentiu ENFURECIDO!!\r\n'}
      else if(target.isStateAffected(14)) {text += target.name() + ' se sentiu NERVOSO!\r\n'}
      break;

    case 'DODGE ATTACK': // DODGE ATTACK
      text = user.name() + ' se prepara para desviar!';
      break;

    case 'DODGE ANNOY': // DODGE ANNOY
      text = user.name() + ' começa a importunar os inimigos!';
      break;

    case 'DODGE TAUNT': // DODGE TAUNT
      text = user.name() + ' começa a provocar os inimigos!\r\n';
      text += "A TAXA DE ACERTO de todos os inimigos caiu no turno!"
      break;

    case 'PASS OMORI':  // KEL PASS OMORI
      text = 'OMORI não estava olhando\r\ne foi acertado!\r\n';
      text += 'OMORI levou 1 de dano!';
      break;

    case 'PASS OMORI 2': //KEL PASS OMORI 2
      text = 'OMORI pegou a bola do KEL!\r\n';
      text += 'OMORI arremeça a bola em\r\n';
      text += target.name() + '!\r\n';
      var OMORI = $gameActors.actor(1);
      if(OMORI.isStateAffected(6)) {text += "OMORI se sentiu FELIZ!\r\n"}
      else if(OMORI.isStateAffected(7)) {text += "OMORI se sentiu EXTÁTICO!!\r\n"}
      text += hpDamageText;
      break;

    case 'PASS AUBREY':  // KEL PASS AUBREY
      text = 'AUBREY chutou a bola para\r\nfora do parque!\r\n';
      text += hpDamageText;
      break;

    case 'PASS HERO':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {text = user.name() + ' arremeça nos inimigos!\r\n';}
      text += hpDamageText;
      break;

    case 'PASS HERO 2':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {
        text = user.name() + '  dá uma enterrada nos inimigos com estilo!\r\n';
        text += "O ATAQUE de todos os inimigos caiu!\r\n";
      }
      text += hpDamageText;
      break;

    //HERO//
    case 'MASSAGE':  // MASSAGE
      text = user.name() + ' massageou ' + target.name() + '!\r\n';
      if(!!target.isAnyEmotionAffected(true)) {
        text += target.name() + ' se acalmou...';
      }
      else {text += "Não teve efeito..."}
      break;

    case 'COOK':  // COOK
      text = user.name() + ' cozinhou um biscoito para ' + target.name() + '!';
      break;

    case 'FAST FOOD': //FAST FOOD
      text = user.name() + ' preparou um lanche rápido para ' + target.name() + '.';
      break;

    case 'JUICE': // JUICE
      text = user.name() + ' fez um refresco para ' + target.name() + '.';
      break;

    case 'SMILE':  // SMILE
      text = user.name() + ' sorriu para ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' perdeu ATAQUE.';}
      else {text += parseNoStateChange(target.name(), "ATAQUE", "diminuiu!\r\n")}
      break;

    case 'DAZZLE':
      text = user.name() + ' sorriu para ' + target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + 'perdeu ATAQUE.\r\n';}
      else {text += parseNoStateChange(target.name(), "ATAQUE", "diminuiu!\r\n")}
      if(!target._noEffectMessage) {
        text += target.name() + ' se sentiu FELIZ!';
      }
      else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!")}
      break;
    case 'TENDERIZE': // TENDERIZE
      text = user.name() + ' massageia intensamente\r\n';
      text += target.name() + '!\r\n';
      if(!target._noStateMessage) {text += target.name() + 'perdeu DEFESA!\r\n';}
      else {text += parseNoStateChange(target.name(), "DEFESA", "diminuiu!\r\n")}
      text += hpDamageText;
      break;

    case 'SNACK TIME':  // SNACK TIME
      text = user.name() + ' cozinhou biscoitos para todo mundo!';
      break;

    case 'TEA TIME': // TEA TIME
      text = user.name() + ' trouxe um pouco de chá para relaxar.\r\n';
      text += target.name() + ` se sentiu refrescad${pronome1}!\r\n`;
      if(result.hpDamage < 0) {
        var absHp = Math.abs(result.hpDamage);
        text += `${target.name()} recuperou ${absHp} de CORAÇÃO!\r\n`
      }
      if(result.mpDamage < 0) {
        var absMp = Math.abs(result.mpDamage);
        text += `${target.name()} recuperou ${absMp} de SUCO...\r\n`
      }
      break;

    case 'SPICY FOOD': // SPICY FOOD
      text = user.name() + ' cozinhou uma comida apimentada!\r\n';
      text += hpDamageText;
      break;

    case 'SINGLE TAUNT': // SINGLE TAUNT
      text = user.name() + ' chamou a atenção de\r\n';
      text += target.name()
      break;

    case 'TAUNT':  // TAUNT
      text = user.name() + ' chamou a atenção dos inimigos.';
      break;

    case 'SUPER TAUNT': // SUPER TAUNT
      text = user.name() + ' chamou a atenção dos inimigos.\r\n';
      text += user.name() + ' se prepara para bloquear os ataques.';
      break;

    case 'ENCHANT':  // ENCHANT
      text = user.name() + ' chama a atenção dos inimigos\r\n';
      text += 'com um sorriso.\r\n';
      if(!target._noEffectMessage) {text += target.name() + " se sentiu FELIZ!";}
      else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!")}
      break;

    case 'MENDING': //MENDING
      text = user.name() + ' serviu ao ' + target.name() + '.\r\n';
      text += user.name() + ' é agora o chef pessoal do ' + target.name();
      break;

    case 'SHARE FOOD': //SHARE FOOD
      if(target.name() !== user.name()) {
        text = user.name() + ' compartilhou comida com ' + target.name() + '!'
      }
      break;

    case 'CALL OMORI':  // CALL OMORI
      text = user.name() + ' acena para o OMORI!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(1).hp);
        if(absHp > 0) {text += `OMORI recupera ${absHp} de CORAÇÃO!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(1).mp);
        if(absMp > 0) {text += `OMORI recupera ${absMp} de SUCO...`;}
      }
      $gameTemp._statsState = undefined;
      break;

    case 'CALL KEL':  // CALL KEL
      text = user.name() + ' prepara psicologicamente KEL!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(3).hp);
        if(absHp > 0) {text += `KEL recupera ${absHp} de CORAÇÃO!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(3).mp);
        if(absMp > 0) {text += `KEL recupera ${absMp} de SUCO...`;}
      }
      break;

    case 'CALL AUBREY':  // CALL AUBREY
      text = user.name() + ' encoraja AUBREY!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if(absHp > 0) {text += `AUBREY recupera ${absHp} de CORAÇÃO!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if(absMp > 0) {text += `AUBREY recupera ${absMp} de SUCO...`;}
      }
      break;

    //PLAYER//
    case 'CALM DOWN':  // PLAYER CALM DOWN
      if(item.id !== 1445) {text = user.name() + ' se acalma.\r\n';} // Process if Calm Down it's not broken;
      if(Math.abs(hpDam) > 0) {text += user.name() + ' recupera ' + Math.abs(hpDam) + ' de CORAÇÃO!';}
      break;

    case 'FOCUS':  // PLAYER FOCUS
      text = user.name() + ' foca.';
      break;

    case 'PERSIST':  // PLAYER PERSIST
      text = user.name() + ' persiste.';
      break;

    case 'OVERCOME':  // PLAYER OVERCOME
      text = user.name() + ' supera.';
      break;

  //UNIVERSAL//
    case 'FIRST AID':  // FIRST AID
      text = user.name() + ' cuida do ' + target.name() + '!\r\n';
      text += target.name() + ' recupera ' + Math.abs(target._result.hpDamage) + ' de CORAÇÃO!';
      break;

    case 'PROTECT':  // PROTECT
      text = user.name() + ' fica na frente de ' + target.name() + '!';
      break;

    case 'GAURD': // GAURD
      text = user.name() + ' prepara-se para bloquear ataques.';
      break;

  //FOREST BUNNY//
    case 'BUNNY ATTACK': // FOREST BUNNY ATTACK
      text = user.name() + ' mordisca ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING': // BUNNY DO NOTHING
      text = user.name() + ' está pulando por aí!';
      break;

    case 'BE CUTE':  // BE CUTE
      text = user.name() + ' pisca para ' + target.name() + '!\r\n';
      text += target.name() + ' perdeu ATAQUE...';
      break;

    case 'SAD EYES': //SAD EYES
      text = user.name() + ' olha tristemente para ' + target.name() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu TRISTE.';}
      else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!")}
      break;

  //FOREST BUNNY?//
    case 'BUNNY ATTACK2': // BUNNY? ATTACK
      text = user.name() + ' mordisca ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING2':  // BUNNY? DO NOTHING
      text = user.name() + ' está pulando por aí?';
      break;

    case 'BUNNY CUTE2':  // BE CUTE?
      text = user.name() + ' pisca para ' + target.name() + '?\r\n';
      text += target.name() + 'perdeu ATAQUE?';
      break;

    case 'SAD EYES2': // SAD EYES?
      text = user.name() + ' olha tristemente para ' + target.name() + '...\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu TRISTE?';}
      else {text += parseNoEffectEmotion(target.name(), "mais TRISTE!")}
      break;

    //SPROUT MOLE//
    case 'SPROUT ATTACK':  // SPROUT MOLE ATTACK
      text = user.name() + ' esbarra\r\n' 
      text += 'em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

      case 'SPROUT NOTHING':  // SPROUT NOTHING
      text = user.name() + " rola por aí.";
      break;

    case 'RUN AROUND':  // RUN AROUND
      text = user.name() + " corre por aí!";
      break;

    case 'HAPPY RUN AROUND': //HAPPY RUN AROUND
      text = user.name() + " corre energicamente!";
       break;

    //MOON BUNNY//
    case 'MOON ATTACK':  // MOON BUNNY ATTACK
      text = user.name() + ' bate em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MOON NOTHING':  // MOON BUNNY NOTHING
      text = user.name() + ' está no mundo da lua.';
      break;

    case 'BUNNY BEAM':  // BUNNY BEAM
      text = user.name() + ' atirou um laser!\r\n';
      text += hpDamageText;
      break;

    //DUST BUNNY//
    case 'DUST NOTHING':  // DUST NOTHING
      text = user.name() + ' está tentando\r\n';
      text += ' se manter controlado.';
      break;

    case 'DUST SCATTER':  // DUST SCATTER
      text = user.name() + ' explodiu!';
      break;

    //U.F.O//
    case 'UFO ATTACK':  // UFO ATTACK
      text = user.name() + ' caiu em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'UFO NOTHING':  // UFO NOTHING
      text = user.name() + ' está perdendo o interesse.';
      break;

    case 'STRANGE BEAM':  // STRANGE BEAM
      text = user.name() + ' jogou uma luz estranha!\r\n';
      text += target.name() + " sentiu uma EMOÇÃO aleatória!"
      break;

    case 'ORANGE BEAM':  // ORANGE BEAM
      text = user.name() + ' atirou um laser laranja!\r\n';
      text += hpDamageText;
      break;

    //VENUS FLYTRAP//
    case 'FLYTRAP ATTACK':  // FLYTRAP ATTACK
      text = user.name() + ' ataca ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FLYTRAP NOTHING':  // FLYTRAP NOTHING
      text = user.name() + ' está mordendo em nada.';
      break;

    case 'FLYTRAP CRUNCH':  // FLYTRAP
      text = user.name() + ' mordeu ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //WORMHOLE//
    case 'WORM ATTACK':  // WORM ATTACK
      text = user.name() + ' bateu em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'WORM NOTHING':  // WORM NOTHING
      text = user.name() + ' está balançando por aí...';
      break;

    case 'OPEN WORMHOLE':  // OPEN WORMHOLE
      text = user.name() + ' abriu um buraco de minhoca!';
      break;

    //MIXTAPE//
    case 'MIXTAPE ATTACK':  // MIXTAPE ATTACK
      text = user.name() + ' bate em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MIXTAPE NOTHING':  // MIXTAPE NOTHING
      text = user.name() + ' está se desenrolando.';
      break;

    case 'TANGLE':  // TANGLE
      text = target.name() + ' ficou preso em ' + user.name() + '!\r\n';
      text += target.name() + ' perdeu ATAQUE...';
      break;

    //DIAL-UP//
    case 'DIAL ATTACK':  // DIAL ATTACK
      text = user.name() + ' é lento.\r\n';
      text += `${target.name()} se machuca em frustração!\r\n`;
      text += hpDamageText;
      break;

    case 'DIAL NOTHING':  // DIAL NOTHING
      text = user.name() + ' está carregando...';
      break;

    case 'DIAL SLOW':  // DIAL SLOW
      text = user.name() + ' fica ainda mais leeeeeeeeeento.\r\n';
      text += 'A VELOCIDADE de todo mundo diminuiu...';
      break;

    //DOOMBOX//
    case 'DOOM ATTACK':  // DOOM ATTACK
      text = user.name() + ' esbarra em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOOM NOTHING':  // DOOM NOTHING
      text = user.name() + ' está ajustando o rádio.';
      break;

    case 'BLAST MUSIC':  // BLAST MUSIC
      text = user.name() + ' botou umas batidas maneiras!';
      break;

    //SHARKPLANE//
    case 'SHARK ATTACK':  // SHARK PLANE
      text = user.name() + ' atropela ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK NOTHING':  // SHARK NOTHING
      text = user.name() + ' está palitando o próprio dente.';
      break;

    case 'OVERCLOCK ENGINE':  // OVERCLOCK ENGINE
      text = user.name() + ' rotaciona sua engrenagem!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' ganhou VELOCIDADE!';
      }
      else {text += parseNoStateChange(user.name(), "VELOCIDADE", "aumentou!")}
      break;

    case 'SHARK CRUNCH':  // SHARK
        text = user.name() + ' abocanhou ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

    //SNOW BUNNY//
    case 'SNOW BUNNY ATTACK':  // SNOW ATTACK
      text = user.name() + ` chutou neve n${pronome2} ` + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW NOTHING':  // SNOW NOTHING
      text = user.name() + ' está relaxando.';
      break;

    case 'SMALL SNOWSTORM':  // SMALL SNOWSTORM
      text = user.name() + ' joga neve em todo mundo,\r\n';
      text += 'causando a menor tempestade de neve do mundo!';
      break;

    //SNOW ANGEL//
    case 'SNOW ANGEL ATTACK': //SNOW ANGEL ATTACK
      text = user.name() + ' encosta em ' + target.name() + '\r\n';
      text += 'com suas mãos geladas.\r\n';
      text += hpDamageText;
      break;

    case 'UPLIFTING HYMN': //UPLIFTING HYMN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta uma linda canção...\r\n';
        text += 'Todo mundo se sentiu FELIZ!';
      }
      target._noEffectMessage = undefined;
      break;

    case 'PIERCE HEART': //PIERCE HEART
      text = user.name() + ' perfura o CORAÇÃO de ' + target.name() + '\r\n';
      text += hpDamageText;
      break;

    //SNOW PILE//
    case 'SNOW PILE ATTACK': //SNOW PILE ATTACK
      text = user.name() + ' joga neve em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW PILE NOTHING': //SNOW PILE NOTHING
      text = user.name() + ' se sentiu congelado.';
      break;

    case 'SNOW PILE ENGULF': //SNOW PILE ENGULF
      text = user.name() + ' engolfa ' + target.name() + ' em neve!\r\n';
      text += user.name() + ' perdeu VELOCIDADE.\r\n';
      text += user.name() + ' perdeu DEFESA.';
      break;

    case 'SNOW PILE MORE SNOW': //SNOW PILE MORE SNOW
      text = user.name() + ' empilha neve em si mesmo!\r\n';
      text += user.name() + ' ganhouu ATAQUE!\r\n';
      text += user.name() + ' ganhou DEFESA!';
      break;

    //CUPCAKE BUNNY//
    case 'CCB ATTACK': //CUP CAKE BUNNY ATTACK
      text = user.name() + ' esbarra em ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CCB NOTHING': //CUP CAKE BUNNY NOTHING
      text = user.name() + ' pula no lugar.';
      break;

    case 'CCB SPRINKLES': //CUP CAKE BUNNY SPRINKLES
      text = user.name() + ' cobre ' + target.name() + '\r\n';
      text += 'em granulado.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu FELIZ!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!\r\n")}
      text += target.name() + " aumentou os STATUS!"
      break;

    //MILKSHAKE BUNNY//
    case 'MSB ATTACK': //MILKSHAKE BUNNY ATTACK
      text = user.name() + ' derrame milkshake em ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'MSB NOTHING': //MILKSHAKE BUNNY NOTHING
      text = user.name() + ' gira em círculos.';
      break;

    case 'MSB SHAKE': //MILKSHAKE BUNNY SHAKE
      text = user.name() + ' começa a sacudir furiosamente!\r\n';
      text += 'Milkshake voa para todo lado!';
      break;

    //PANCAKE BUNNY//
    case 'PAN ATTACK': //PANCAKE BUNNY ATTACK
      text = user.name() + ' mordisca ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PAN NOTHING': //PANCAKE BUNNY NOTHING
      text = user.name() + ' faz um mortal!\r\n';
      text += 'Tão talentoso!';
      break;

    //STRAWBERRY SHORT SNAKE//
    case 'SSS ATTACK': //STRAWBERRY SHORT SNAKE ATTACK
      text = user.name() + ' enfia seus dentes em ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SSS NOTHING': //STRAWBERRY SHORT SNAKE NOTHING
      text = user.name() + ' rosna.';
      break;

    case 'SSS SLITHER': //STRAWBERRY SHORT SNAKE SLITHER
      text = user.name() + ' escorrega por aí alegremente!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se sentiu FELIZ!';}
      else {text += parseNoEffectEmotion(user.name(), "mais FELIZ!")}
      break;

    //PORCUPIE//
    case 'PORCUPIE ATTACK': //PORCUPIE ATTACK
      text = user.name() + ' cutuca ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PORCUPIE NOTHING': //PORCUPIE NOTHING
      text = user.name() + ' fareja.';
      break;

    case 'PORCUPIE PIERCE': //PORCUPIE PIERCE
      text = user.name() + ' empala ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //BUN BUNNY//
    case 'BUN ATTACK': //BUN ATTACK
      text = user.name() + ' bate os pãezinhos ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUN NOTHING': //BUN NOTHING
      text = user.name() + ' está vadiando por aí.';
      break;

    case 'BUN HIDE': //BUN HIDE
      text = user.name() + ' se esconde em um pãozinho.';
      break;

    //TOASTY//
    case 'TOASTY ATTACK': //TOASTY ATTACK
      text = user.name() + ' agride ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'TOASTY NOTHING': //TOASTY NOTHING
      text = user.name() + ' cutuca o nariz.';
      break;

    case 'TOASTY RILE': //TOASTY RILE
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' deu um discurso controverso!\r\n';
        text += 'Todo mundo se sentiu NERVOSO!';
      }
      target._noEffectMessage = undefined;
      break;

    //SOURDOUGH//
    case 'SOUR ATTACK': //SOURDOUGH ATTACK
      text = user.name() + ' pisa no pé de ' + target.name() + '\r\n';
      text += hpDamageText;
      break;

    case 'SOUR NOTHING': //SOURDOUGH NOTHING
      text = user.name() + ' chuta sujeira no chão.';
      break;

    case 'SOUR BAD WORD': //SOURDOUGH BAD WORD
      text = 'Oh não! ' + user.name() + ' diz um palavrão!\r\n';
      text += hpDamageText;
      break;

    //SESAME//
    case 'SESAME ATTACK': //SESAME ATTACK
      text = user.name() + ' arremessa sementes em ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SESAME NOTHING': //SESAME Nothing
      text = user.name() + ' coça a cabeça.';
      break;

    case 'SESAME ROLL': //SESAME BREAD ROLL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' rola por cima de todos!\r\n';
      }
      text += hpDamageText;
      break;

    //CREEPY PASTA//
    case 'CREEPY ATTACK': //CREEPY ATTACK
      text = user.name() + ' faz ' + target.name() + ' se sentir\r\n';
      text += 'desconfortável.\r\n';
      text += hpDamageText;
      break;

    case 'CREEPY NOTHING': //CREEPY NOTHING
      text = user.name() + ' faz nada... ameaçadoramente!';
      break;

    case 'CREEPY SCARE': //CREEPY SCARE
      text = user.name() + ' mostra à todos seus piores\r\n';
      text += 'pesadelos!';
      break;

    //COPY PASTA//
    case 'COPY ATTACK': //COPY ATTACK
      text = user.name() + ' dá uma pancada em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DUPLICATE': //DUPLICATE
      text = user.name() + ' duplica ele mesmo! ';
      break;

    //HUSH PUPPY//
    case 'HUSH ATTACK': //HUSH ATTACK
      text = user.name() + ' corre e atropela ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HUSH NOTHING': //HUSH NOTHING
      text = user.name() + ' tenta latir...\r\n';
      text += 'Mas nada acontece...';
      break;

    case 'MUFFLED SCREAMS': //MUFFLED SCREAMS
      text = user.name() + ' começa a gritar!\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI") {
        text += target.name() + ' se sentiu ASSUSTADO.';
      }
      else {text += parseNoEffectEmotion(target.name(), "ASSUSTADO")}
      break;

    //GINGER DEAD MAN//
    case 'GINGER DEAD ATTACK': //GINGER DEAD MAN ATTACK
      text = user.name() + ' esfaqueia ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GINGER DEAD NOTHING': //GINGER DEAD MAN DO NOTHING
      text = user.name() + ' deixou a cabeça cair...\r\n';
      text += user.name() + ' coloca de volta a cabeça.';
      break;

    case 'GINGER DEAD THROW HEAD': //GINGER DEAD MAN THROW HEAD
      text = user.name() + ' arremessa sua cabeça em\r\n';
      text +=  target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //LIVING BREAD//
    case 'LIVING BREAD ATTACK': //LIVING BREAD ATTACK
      text = user.name() + ' desliza em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD NOTHING': //LIVING BREAD ATTACK
      text = user.name() + ' se arrasta devagar em direção a\r\n';
      text += target.name() + '!';
      break;

    case 'LIVING BREAD BITE': //LIVING BREAD BITE
      text = user.name() + ' morde ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD BAD SMELL': //LIVING BREAD BAD SMELL
      text = user.name() + ' fede!\r\n';
      text += target.name() + ' perdeu DEFESA!';
      break;

    //Bug Bunny//
    case 'BUG BUN ATTACK': //Bug Bun Attack
     text = user.name() + ' desliza em ' + target.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'BUG BUN NOTHING': //Bug Bun Nothing
      text = user.name() + ' tenta se esquilibrar em sua cabeça. ';
      break;

    case 'SUDDEN JUMP': //SUDDEN JUMP
      text = user.name() + ' de repente ataca ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SCUTTLE': //Bug Bun Scuttle
      text = user.name() + ' corre alegremente por aí.\r\n';
      text += 'Foi muito fofo!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se sentiu FELIZ!';}
      else {text += parseNoEffectEmotion(user.name(), "mais FELIZ!")}
      break;

    //RARE BEAR//
    case 'BEAR ATTACK': //BEAR ATTACK
      text = user.name() + ' dá uma patada em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BEAR HUG': //BEAR HUG
      text = user.name() + ' abraça ' + target.name() + '!\r\n';
      text += target.name() + ' perdeu VELOCIDADE!\r\n';
      text += hpDamageText;
      break;

    case 'ROAR': //ROAR
      text = user.name() + ' solta um rugido enorme!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' se sentiu NERVOSO!';}
      else {text += parseNoEffectEmotion(user.name(), "mais NERVOSO!")}
      break;

    //POTTED PALM//
    case 'PALM ATTACK': //PALM ATTACK
      text = user.name() + ' esbarra em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PALM NOTHING': //PALM NOTHING
      text = user.name() + ' está descansando em seu pote. ';
      break;

    case 'PALM TRIP': //PALM TRIP
      text = target.name() + ' tropeça nas raízes de ' + user.name() + '\r\n';
      text += hpDamageText + '.\r\n';
      text += target.name() + ' perdeu VELOCIDADE.';
      break;

    case 'PALM EXPLOSION': //PALM EXPLOSION
      text = user.name() + ' explode!';
      break;

    //SPIDER CAT//
    case  'SPIDER ATTACK': //SPIDER ATTACK
      text = user.name() + ' morde ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPIDER NOTHING': //SPIDER NOTHING
      text = user.name() + ' vomita uma bola de teia.';
      break;

    case 'SPIN WEB': //SPIN WEB
       text = user.name() + ' atira teia em ' + target.name() + '!\r\n';
       text += target.name() + ' perdeu VELOCIDADE.';
       break;

    //SPROUT MOLE?//
    case 'SPROUT ATTACK 2':  // SPROUT MOLE? ATTACK
      text = user.name() + ' bate em ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING 2':  // SPROUT MOLE? NOTHING
      text = user.name() + ' está correndo por aí?';
      break;

    case 'SPROUT RUN AROUND 2':  // SPROUT MOLE? RUN AROUND
      text = user.name() + ' corre por aí?';
      break;

    //HAROLD//
    case 'HAROLD ATTACK': //HAROLD ATTACK
      text = user.name() + ' acerta sua espada em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HAROLD NOTHING': // HAROLD NOTHING
      text = user.name() + ' arruma seu elmo.';
      break;

    case 'HAROLD PROTECT': // HAROLD PROTECT
      text = user.name() + ' se protege.';
      break;

    case 'HAROLD WINK': //HAROLD WINK
      text = user.name() + ' pisca para ' + target.name() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu FELIZ!';}
      else {text += parseNoEffectEmotion(target.name(), "mais FELIZ!")}
      break;

    //MARSHA//
    case 'MARSHA ATTACK': //MARSHA ATTACK
      text = user.name() + ' acerta seu machado em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA NOTHING': //MARSHA NOTHING
      text = user.name() + ' cai no chão. ';
      break;

    case 'MARSHA SPIN': //MARSHA NOTHING
      text = user.name() + ' começa a girar em velocidade máxima!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA CHOP': //MARSHA CHOP
      text = user.name() + ' bate com seu machado em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    //THERESE//
    case 'THERESE ATTACK': //THERESE ATTACK
      text = user.name() + ' arremeça uma flecha em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE NOTHING': //THERESE NOTHING
      text = user.name() + ' larga uma flecha.';
      break;

    case 'THERESE SNIPE': //THERESE SNIPE
      text = user.name() + ' atira no ponto fraco de ' + target.name() + '\r\n';
      text += hpDamageText;
      break;

    case 'THERESE INSULT': //THERESE INSULT
      text = user.name() + ' chama ' + target.name() + ' de cabeça oca!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' se sentiu NERVOSO!\r\n';}
      else {text += parseNoEffectEmotion(target.name(), "mais NERVOSO!\r\n")}
      text += hpDamageText;
      break;

    case 'DOUBLE SHOT': //THERESE DOUBLE SHOT
      text = user.name() + ' atira duas flechas de uma vez!';
      break;

    //LUSCIOUS//
    case 'LUSCIOUS ATTACK': //LUSCIOUS ATTACK
      text = user.name() + ' tenta lançar um feitiço...\r\n';
      text += user.name() + ' fez alguma coisa mágica!\r\n';
      text += hpDamageText;
      break;

    case 'LUSCIOUS NOTHING': //LUSCIOUS NOTHING
      text = user.name() + ' tenta lançar um feitiço...\r\n';
      text += 'Mas nada aconteceu...';
      break;

    case 'FIRE MAGIC': //FIRE MAGIC
      text = user.name() + ' tenta lançar um feitiço...\r\n';
      text += user.name() + ' incendeia OMORI e seus amigos!\r\n';
      text += hpDamageText;
      break;

    case 'MISFIRE MAGIC': //MISFIRE MAGIC
      text = user.name() + ' tenta lançar um feitiço...\r\n';
      text += user.name() + ' taca fogo no lugar inteiro!!!\r\n';
      text += hpDamageText;
      break;

    //HORSE HEAD//
    case 'HORSE HEAD ATTACK': //HORSE HEAD ATTACK
      text = user.name() + ' morde o braço de ' + target.name() + '\r\n';
      text += hpDamageText;
      break;

    case 'HORSE HEAD NOTHING': //HORSE HEAD NOTHING
      text = user.name() + ' arrota.';
      break;

    case 'HORSE HEAD LICK': //HORSE HEAD LICK
     text = user.name() + ' lambe o cabelo de ' + target.name() + '\r\n';
     text += hpDamageText + '\r\n';
     if(!target._noEffectMessage) {text += target.name() + ' se sentiu NERVOSO!';}
     else {text += parseNoEffectEmotion(target.name(), "mais NERVOSO!")}
     break;

    case 'HORSE HEAD WHINNY': //HORSE HEAD WHINNY
      text = user.name() + ' relincha alegremente!';
      break;

    //HORSE BUTT//
    case 'HORSE BUTT ATTACK': //HORSE BUTT ATTACK
      text = user.name() + ' pisa em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT NOTHING': //HORSE BUTT NOTHING
      text = user.name() + ' peida.';
      break;

    case 'HORSE BUTT KICK': //HORSE BUTT KICK
      text = user.name() + ' chuta ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT PRANCE': //HORSE BUTT PRANCE
      text = user.name() + ' cavalga por aí.';
      break;

    //FISH BUNNY//
    case 'FISH BUNNY ATTACK': //FISH BUNNY ATTACK
      text = user.name() + ' nada até ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FISH BUNNY NOTHING': //FISH BUNNY NOTHING
      text = user.name() + ' nada em círculos. ';
      break;

    case 'SCHOOLING': //SCHOOLING
      text = user.name() + ' chama por seus amigos! ';
      break;

    //MAFIA ALLIGATOR//
    case 'MAFIA ATTACK': //MAFIA ATTACK
      text = user.name() + ' dá um golpe de karatê em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA NOTHING': //MAFIA NOTHING
      text = user.name() + ' estala seus dedos.';
      break;

    case 'MAFIA ROUGH UP': //MAFIA ROUGH UP
      text = user.name() + ' agride ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA BACK UP': //MAFIA ALLIGATOR BACKUP
      text = user.name() + ' chama reforço!';
      break;

    //MUSSEL//
    case 'MUSSEL ATTACK': //MUSSEL ATTACK
      text = user.name() + ' soca ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MUSSEL FLEX': //MUSSEL FLEX
     text = user.name() + ' flexiona e se sente fortão!\r\n';
     text += user.name() + " aumentou a TAXA CRÍTICA!\r\n"
     break;

    case 'MUSSEL HIDE': //MUSSEL HIDE
     text = user.name() + ' se esconde em sua concha.';
     break;

    //REVERSE MERMAID//
    case 'REVERSE ATTACK': //REVERSE ATTACK
     text = target.name() + ' esbarra em ' + user.name() + '!\r\n';
     text += hpDamageText;
     break;

    case 'REVERSE NOTHING': //REVERSE NOTHING
     text = user.name() + ' faz um mortal!\r\n';
     text += 'UAU!';
     break;

    case 'REVERSE RUN AROUND': //REVERSE RUN AROUND
      text = 'Todo mundo corre de ' + user.name() + ',\r\n';
      text += 'mas acabam correndo na direção dele...\r\n';
      text += hpDamageText;
      break;

    //SHARK FIN//
    case 'SHARK FIN ATTACK': //SHARK FIN ATTACK
      text = user.name() + ' dá uma investida em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK FIN NOTHING': //SHARK FIN NOTHING
      text = user.name() + ' nada em círculos.';
      break;

    case 'SHARK FIN BITE': //SHARK FIN BITE
      text = user.name() + ' morde ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK WORK UP': //SHARK FIN WORK UP
      text = user.name() + ' começa a malhar!\r\n';
      text += user.name() + ' aumentou a VELOCIDADE!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' se sentiu NERVOSO!';
      }
      else {text += parseNoEffectEmotion(user.name(), "mais NERVOSO!")}
      break;

    //ANGLER FISH//
    case 'ANGLER ATTACK': //ANGLER FISH ATTACK
      text = user.name() + ' morde ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGLER NOTHING': //ANGLER FISH NOTHING
      text = user.name() + ' sente fome.';
      break;

    case 'ANGLER LIGHT OFF': //ANGLER FISH LIGHT OFF
      text = user.name() + ' desliga sua luz.\r\n';
      text += user.name() + ' desaparece na escuridão.';
      break;

    case 'ANGLER BRIGHT LIGHT': //ANGLER FISH BRIGHT LIGHT
      text = 'Todos vêem suas vidas passar\r\n';
      text += 'diante de seus olhos!';
      break;

    case 'ANGLER CRUNCH': //ANGLER FISH CRUNCH
      text = user.name() + ' empala ' + target.name() + ' com seus dentes!\r\n';
      text += hpDamageText;
      break;

    //SLIME BUNNY//
    case 'SLIME BUN ATTACK': //SLIME BUNNY ATTACK
      text = user.name() + ' se aconchega em ' + target.name() +'.\r\n';
      text += hpDamageText;
      break;

    case 'SLIME BUN NOTHING': //SLIME BUN NOTHING
      text = user.name() + ' sorri para todo mundo.\r\n';
      break;

    case 'SLIME BUN STICKY': //SLIME BUN STICKY
      text = user.name() + ' se sente sozinho e chora.\r\n';
      if(!target._noStateMessage) {text += target.name() + '\'s SPEED fell!\r\n';}
      else {text += parseNoStateChange(target.name(), "SPEED", "lower!\r\n")}
      text += target.name() + " feels SAD.";
      break;

    //WATERMELON MIMIC//
    case 'WATERMELON RUBBER BAND': //WATERMELON MIMIC RUBBER BAND
      text = user.name() + ' flings a RUBBER BAND!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON JACKS': //WATERMELON MIMIC JACKS
      text = user.name() + ' throws JACKS everywhere!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON DYNAMITE': //WATERMELON MIMIC DYNAMITE
      text = user.name() + ' lobs DYNAMITE!\r\n';
      text += 'OH NO!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON WATERMELON SLICE': //WATERMELON MIMIC WATERMELON SLICE
      text = user.name() + ' throws WATERMELON JUICE!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON GRAPES': //WATERMELON MIMIC GRAPES
      text = user.name() + ' throws GRAPE SODA!\r\n';
      text += hpDamageText;
      break;

    case 'WATEMELON FRENCH FRIES': //WATERMELON MIMIC FRENCH FRIES
      text = user.name() + ' throws FRENCH FRIES!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON CONFETTI': //WATERMELON MIMIC CONFETTI
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' throws CONFETTI!\r\n';
        text += "Everyone feels HAPPY!"
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON RAIN CLOUD': //WATERMELON MIMIC RAIN CLOUD
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' summons a RAIN CLOUD!\r\n';
        text += "Everyone feels SAD."
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON AIR HORN': //WATERMELON MIMIC AIR HORN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' uses a GIANT AIRHORN!\r\n';
        text += "Everyone feels ANGRY!"
      }
      target._noEffectMessage = undefined;
      break;

    //SQUIZZARD//
    case 'SQUIZZARD ATTACK': //SQUIZZARD ATTACK
      text = user.name() + ' uses magic on ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SQUIZZARD NOTHING': //SQUIZZARD NOTHING
      text = user.name() + ' mutters nonsense.';
      break;

    case 'SQUID WARD': //SQUID WARD
      text = user.name() + ' creates a squid ward.\r\n';
      text += target.name() + '\'s DEFENSE increased.';
      break;

    case  'SQUID MAGIC': //SQUID MAGIC
      text = user.name() +  ' casts some squid magic!\r\n';
      text += 'Everyone starts feeling weird...';
      break;

    //WORM-BOT//
    case 'BOT ATTACK': //MECHA WORM ATTACK
      text = user.name() + ' slams into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT NOTHING': //MECHA WORM NOTHING
      text = user.name() + ' crunches loudly!';
      break;

    case 'BOT LASER': //MECHA WORM CRUNCH
      text = user.name() + ' fires a laser at ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT FEED': //MECHA WORM FEED
      text = user.name() + ' eats ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;


    //SNOT BUBBLE//
    case 'SNOT INFLATE': //SNOT INFLATE
      text = user.name() + '\'s snot inflated!\r\n';
      text += target.name() + '\'s ATTACK rose!';
      break;

    case 'SNOT POP': //SNOT POP
      text = user.name() + ' explodes!\r\n';
      text += 'Snot flies everywhere!!\r\n';
      text += hpDamageText;
      break;

    //LAB RAT//
    case  'LAB ATTACK': //LAB RAT ATTACK
      text = user.name() + ' fires a tiny mouse laser!\r\n';
      text += hpDamageText;
      break;

    case  'LAB NOTHING': //LAB RAT NOTHING
      text = user.name() + ' lets out a little steam.';
      break;

    case  'LAB HAPPY GAS': //LAB RAT HAPPY GAS
      text = user.name() + ' releases HAPPY gas!\r\n';
      text += 'Everyone feels HAPPY!';
      target._noEffectMessage = undefined;
      break;

    case  'LAB SCURRY': //LAB RAT SCURRY
      text = user.name() + ' scurries around!\r\n';
      break;

    //MECHA MOLE//
    case 'MECHA MOLE ATTACK': //MECHA MOLE ATTACK
      text = user.name() + ' fires a laser at ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MECHA MOLE NOTHING': //MECHA MOLE NOTHING
      text = user.name() + '\'s eye glows a little.';
      break;

    case 'MECHA MOLE EXPLODE': //MECHA MOLE EXPLODE
      text = user.name() + ' sheds a single tear.\r\n';
      text += user.name() + ' gloriously explodes!';
      break;

    case 'MECHA MOLE STRANGE LASER': //MECHA MOLE STRANGE LASER
      text = user.name() + '\'s eyes emits a strange\r\n';
      text += 'light. ' + target.name() + ' felt strange.';
      break;

    case 'MECHA MOLE JET PACK': //MECHA MOLE JET PACK
      text = 'A jet pack appeared on ' + user.name() + '!\r\n';
      text += user.name() + ' flew through everyone!';
      break;

    //CHIMERA CHICKEN//
    case 'CHICKEN RUN AWAY': //CHIMERA CHICKEN RUN AWAY
      text = user.name() + ' runs away.';
      break;

    case 'CHICKEN NOTHING': //CHICKEN DO NOTHING
      text = user.name() + ' clucks. ';
      break;

    //SALLI//
    case 'SALLI ATTACK': //SALLI ATTACK
      text = user.name() + ' runs into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SALLI NOTHING': //SALLI NOTHING
      text = user.name() + ' did a small flip!';
      break;

    case 'SALLI SPEED UP': //SALLI SPEED UP
      text = user.name() + ' starts speeding around the room!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + '\'s SPEED rose!';
      }
      else {text += parseNoStateChange(user.name(), "SPEED", "higher!")}
      break;

    case 'SALLI DODGE ANNOY': //SALLI STARE
      text = user.name() + ' begins focusing intensely! ';
      break;

    //CINDI//
    case 'CINDI ATTACK': //CINDI ATTACK
      text = user.name() + ' punches ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI NOTHING': //CINDI NOTHING
      text = user.name() + ' spins in a circle.';
      break;

    case 'CINDI SLAM': //CINDI SLAM
      text = user.name() + ' slams her arm into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI COUNTER ATTACK': //CINDI COUNTER ATTACK
      text = user.name() + ' readies themselves!';
      break;

    //DOROTHI//
    case 'DOROTHI ATTACK': //DOROTHI ATTACK
      text = user.name() + ' stomps on ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI NOTHING': //DOROTHI NOTHING
      text = user.name() + ' cries into the darkness.';
      break;

    case 'DOROTHI KICK': //DOROTHI KICK
      text = user.name() + ' kicks ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI HAPPY': //DOROTHI HAPPY
      text = user.name() + ' prances around!';
      break;

    //NANCI//
    case 'NANCI ATTACK': //NANCI ATTACK
      text = user.name() + ' stabs her claws into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'NANCI NOTHING': //NANCI NOTHING
      text = user.name() + ' sways back and forth.';
      break;

    case 'NANCI ANGRY': //NANCI ANGRY
      text = user.name() + ' starts boiling up!';
      break;

    //MERCI//
    case 'MERCI ATTACK': //MERCI ATTACK
      text = user.name() + ' touches ' + target.name() + '\'s chest.\r\n';
      text += target.name() + ' feels their organs being torn!\r\n';
      text += hpDamageText;
      break;

    case 'MERCI NOTHING': //MERCI NOTHING
      text = user.name() + ' gives an eerie smile.';
      break;

    case 'MERCI MELODY': //MERCI LAUGH
      text = user.name() + ' sings a song.\r\n';
      text += target.name() + ' hears a familiar melody.\r\n';
      if(target.isStateAffected(6)) {text += target.name() + " feels HAPPY!\r\n"}
      else if(target.isStateAffected(7)) {text += target.name() + " feels ECSTATIC!!\r\n"}
      else if(target.isStateAffected(8)) {text += target.name() + " feels MANIC!!!\r\n"}
      break;

    case 'MERCI SCREAM': //MERCI SCREAM
      text = user.name() + ' makes a horrifying shriek!\r\n';
      text += hpDamageText;
      break;


    //LILI//
    case 'LILI ATTACK': //LILI ATTACK
      text = user.name() + ' stares into ' + target.name() + '\'s soul!\r\n';
      text += hpDamageText;
      break;

    case 'LILI NOTHING': //LILI NOTHING
      text = user.name() + ' winks.';
      break;

    case 'LILI MULTIPLY': //LILI MULTIPLY
      text = user.name() + '\'s eye falls off!\r\n';
      text += 'The eye grew into another ' + user.name() + '!';
      break;

    case 'LILI CRY': //LILI CRY
      text = 'Tears well up in ' + user.name() + '\'s eyes.\r\n';
      text += target.name() + " feels SAD."
      break;

    case 'LILI SAD EYES': //LILI SAD EYES
      text = target.name() + ' saw sadness in ' + user.name() + '\'s eyes.\r\n';
      text += target.name() + ' became reluctant to attack ' + user.name(); + '.\r\n'
      break;

    //HOUSEFLY//
    case 'HOUSEFLY ATTACK': //HOUSEFLY ATTACK
      text = user.name() + ' landed on ' + target.name() + '\'s face.\r\n';
      text += target.name() + ' slaps himself in the face!\r\n';
      text += hpDamageText;
      break;

    case 'HOUSEFLY NOTHING': //HOUSEFLY NOTHING
      text = user.name() + ' buzzes around quickly!';
      break;

    case 'HOUSEFLY ANNOY': //HOUSEFLY ANNOY
      text = user.name() + ' buzzes around ' + target.name() + '\'s ear!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' feels ANGRY!';}
      else {text += parseNoEffectEmotion(target.name(), "ANGRIER!")}
      break;

    //RECYCLIST//
    case 'FLING TRASH': //FLING TRASH
      text = user.name() + ' flings TRASH at ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GATHER TRASH': //GATHER TRASH
      text = user.name() + ' finds TRASH on the ground\r\n';
      text += 'and sweeps it in their bag!\r\n';
      text += hpDamageText;
      break;

    case 'RECYCLIST CALL FOR FRIENDS': //RECYCLIST CALL FOR FRIENDS
      text = user.name() + ' did the RECYCULTIST\'s call!!';
      break;

    //STRAY DOG//
    case 'STRAY DOG ATTACK': //STRAY DOG ATTACK
      text = user.name() + ' uses a biting attack!\r\n';
      text += hpDamageText;
      break;

    case 'STRAY DOG HOWL': //STRAY DOG HOWL
      text = user.name() + ' makes a piercing howl!';
      break;

    //CROW//
    case 'CROW ATTACK': //CROW ATTACK
      text = user.name() + ' pecks at ' + target.name() + '\'s eyes.\r\n';
      text += hpDamageText;
      break;

    case 'CROW GRIN': //CROW GRIN
      text = user.name() + ' has a big grin on his face.';
      break;

    case 'CROW STEAL': //CROW STEAL
      text = user.name() + ' steals something!';
      break;

    // BEE //
    case 'BEE ATTACK': //BEE Attack
      text = user.name() + ' stings ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'BEE NOTHING': //BEE NOTHING
      text = user.name() + ' flies around quickly!';
      break;

    // GHOST BUNNY //
    case 'GHOST BUNNY ATTACK': //GHOST BUNNY ATTACK
      text = user.name() + ' phases through ' + target.name() + '!\r\n';
      text += target.name() + ' feels tired.\r\n';
      text += mpDamageText;
      break;

    case 'GHOST BUNNY NOTHING': //GHOST BUNNY DO NOTHING
      text = user.name() + ' floats in place.';
      break;

    //TOAST GHOST//
    case 'TOAST GHOST ATTACK': //TOAST GHOST ATTACK
      text = user.name() + ' phases through ' + target.name() + '!\r\n';
      text += target.name() + ' feels tired.\r\n';
      text += hpDamageText;
      break;

    case 'TOAST GHOST NOTHING': //TOAST GHOST NOTHING
      text = user.name() + ' makes a spooky noise.';
      break;

    //SPROUT BUNNY//
    case 'SPROUT BUNNY ATTACK': //SPROUT BUNNY ATTACK
      text = user.name() + ' dá um tapa em ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT BUNNY NOTHING': //SPROUT BUNNY NOTHING
      text = user.name() + ' mordisca na grama.';
      break;

    case 'SPROUT BUNNY FEED': //SPROUT BUNNY FEED
      text = user.name() + ' alimenta ' + target.name() + '.\r\n';
      text += `${user.name()} recupera ${Math.abs(hpDam)} de CORAÇÃO!`
      break;

    //CELERY//
    case 'CELERY ATTACK': //CELERY ATTACK
      text = user.name() + ' rams into ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CELERY NOTHING': //CELERY NOTHING
      text = user.name() + ' falls over.';
      break;

    //CILANTRO//
    case 'CILANTRO ATTACK': //CILANTRO ATTACK
      text = user.name() + ' whacks ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CILANTRO NOTHING': //CILANTRO DO NOTHING
      text = user.name() + ' contemplates life.';
      break;

    case 'GARNISH': //CILANTRO GARNISH
      text = user.name() + ' sacrifices themselves\r\n';
      text += 'to improve ' + target.name() + '.';
      break;

    //GINGER//
    case 'GINGER ATTACK': //GINGER ATTACK
      text = user.name() + ' snaps and attacks ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'GINGER NOTHING': //GINGER NOTHING
      text = user.name() + ' finds inner peace.';
      break;

    case 'GINGER SOOTHE': //GINGER SOOTHE
      text = user.name() + ' calms down ' + target.name() + '.\r\n';
      break;

    //YE OLD MOLE//
    case 'YE OLD ROLL OVER': //MEGA SPROUT MOLE ROLL OVER
      text = user.name() + ' rola por cima!';
      text += hpDamageText;
      break;

    //KITE KID//
    case 'KITE KID ATTACK':  // KITE KID ATTACK
      text = user.name() + ' throws JACKS at ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE KID BRAG':  // KITE KID BRAG
      text = user.name() + ' brags about KID\'s KITE!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' feels HAPPY!';
      }
      else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
      break;

    case 'REPAIR':  // REPAIR
      text = user.name() + ' tapes up KID\'s KITE!\r\n';
      text += 'KID\'S KITE feels good as new!';
      break;

    //KID'S KITE//
    case 'KIDS KITE ATTACK': // KIDS KITE ATTACK
      text = user.name() + ' dives at ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE NOTHING': // KITE NOTHING
      text = user.name() + ' puffs its chest proudly!';
      break;

    case 'FLY 1':  // FLY 1
      text = user.name() + ' flies up really high!';
      break;

    case 'FLY 2':  // FLY 2
      text = user.name() + ' swoops down!!';
      break;

    //PLUTO//
    case 'PLUTO NOTHING':  // PLUTO NOTHING
      text = user.name() + ' faz uma pose!\r\n';
      break;

    case 'PLUTO HEADBUTT':  // PLUTO HEADBUTT
      text = user.name() + ' se propulsiona pra frente e bate em ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PLUTO BRAG':  // PLUTO BRAG
      text = user.name() + ' se gaba de seus músculos!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' se sentiu FELIZ!';
      }
      else {text += parseNoEffectEmotion(user.name(), "mais FELIZ!")}
      break;

    case 'PLUTO EXPAND':  // PLUTO EXPAND
      text = user.name() + ' usou anabolizantes!!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' ganhou ATAQUE e DEFESA!!\r\n';
        text += user.name() + ' perdeu VELOCIDADE.';
      }
      else {
        text += parseNoStateChange(user.name(), "ATAQUE", "aumentou!\r\n")
        text += parseNoStateChange(user.name(), "DEFESA", "aumentou!\r\n")
        text += parseNoStateChange(user.name(), "VELOCIDADE", "diminuiu!")
      }
      break;

    case 'EXPAND NOTHING':  // PLUTO NOTHING
      text = user.name() + 'e seus músculos\r\n';
      text += 'te intimidam.';
      break;

    //RIGHT ARM//
    case 'R ARM ATTACK':  // R ARM ATTACK
      text = user.name() + ' cortou ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GRAB':  // GRAB
      text = user.name() + ' agarrou ' + target.name() + '!\r\n';
      text += target.name() + ' perdeu VELOCIDADE.\r\n';
      text += hpDamageText;
      break;

    //LEFT ARM//
    case 'L ARM ATTACK':  // L ARM ATTACK
      text = user.name() + ' socou ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'POKE':  // POKE
      text = user.name() + ' cutuca ' + target.name() + '!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ` se sentiu NERVOS${pronome1}!\r\n`;
      }
      else {text += parseNoEffectEmotion(target.name(), "mais NERVOSO!\r\n")}
      text += hpDamageText;
      break;

    //DOWNLOAD WINDOW//
    case 'DL DO NOTHING':  // DL DO NOTHING
      text = user.name() + ' está em 99%.';
      break;

    case 'DL DO NOTHING 2':  // DL DO NOTHING 2
      text = user.name() + ' ainda está em 99%...';
      break;

    case 'DOWNLOAD ATTACK':  // DOWNLOAD ATTACK
      text = user.name() + ' bugou e queimou!';
      break;

    //SPACE EX-BOYFRIEND//
    case 'SXBF ATTACK':  // SXBF ATTACK
      text = user.name() + ' chutou ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SXBF NOTHING':  // SXBF NOTHING
      text = user.name() + ' olha melancolicamente\r\n';
      text += 'para o horizonte.';
      break;

    case 'ANGRY SONG':  // ANGRY SONG
      text = user.name() + ' lamenta intensamente!';
      break;

    case 'ANGSTY SONG':  // ANGSTY SONG
      text = user.name() + ' canta tristemente...\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' se sentiu TRISTE.';}
      else if(target.isStateAffected(11)) {text += target.name() + ` se sentiu DEPRIMID${pronome1}..`;}
      else if(target.isStateAffected(12)) {text += target.name() + ' se sentiu MISERÁVEL...';}
      break;

    case 'BIG LASER':  // BIG LASER
      text = user.name() + ' atira com seu laser!\r\n';
      text += hpDamageText;
      break;

    case 'BULLET HELL':  // BULLET HELL
      text = user.name() + ' atirou com seu\r\n';
      text += 'laser loucamente em desespero!';
      break;

    case 'SXBF DESPERATE':  // SXBF NOTHING
      text = user.name() + '\r\n';
      text += 'cerra seus dentes!';
      break;

    //THE EARTH//
    case 'EARTH ATTACK':  // EARTH ATTACK
      text = user.name() + ' ataca ' + target.name() + '!\r\n';
      text += hpDamageText
      break;

    case 'EARTH NOTHING':  // EARTH NOTHING
      text = user.name() + ' está rotacionando devagar.';
      break;

    case 'EARTH CRUEL':  // EARTH CRUEL
      text = user.name() + ' é cruel com ' + target.name() + '!\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' se sentiu TRISTE.';}
      else if(target.isStateAffected(11)) {text += target.name() + ` se sentiu DEPRIMID${pronome1}..`;}
      else if(target.isStateAffected(12)) {text += target.name() + ' se sentiu MISERÁVEL...';}
      break;

    case 'CRUEL EPILOGUE':  // EARTH CRUEL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " é cruel com todo mundo...\r\n";
        text += "Todo mundo se sentiu TRISTE."
      }
      break;

    case 'PROTECT THE EARTH':  // PROTECT THE EARTH
      text = user.name() + ' usa seu ataque mais forte!';
      break;

    //SPACE BOYFRIEND//
    case 'SBF ATTACK': //SPACE BOYFRIEND ATTACK
      text = user.name() + ' chuta rapidamente ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SBF LASER': //SPACE BOYFRIEND LASER
      text = user.name() + ' atira com seu laser!\r\n';
      text += hpDamageText;
      break;

    case 'SBF CALM DOWN': //SPACE BOYFRIEND CALM DOWN
      text = user.name() + ' esvazia sua mente\r\n';
      text += 'e remove qualquer EMOÇÃO.';
      break;

    case 'SBF ANGRY SONG': //SPACE BOYFRIEND ANGRY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' lamenta com toda sua raiva!\r\n';
        text += "Todo mundo se sentiu NERVOSO!\r\n";
      }
      text += hpDamageText;
      break;

    case 'SBF ANGSTY SONG': //SPACE BOYFRIEND ANGSTY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta com toda a escuridão\r\n';
        text += 'em sua alma!\r\n';
        text += "Todo mundo se sentiu TRISTE.\r\n";
      }
      text += mpDamageText;
      break;

    case 'SBF JOYFUL SONG': //SPACE BOYFRIEND JOYFUL SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' canta com toda a alegria\r\n';
        text += "em seu coração!\r\n"
        text += "Todo mundo se sentiu FELIZ!\r\n";
      }
      text += hpDamageText;
      break;

    //NEFARIOUS CHIP//
    case 'EVIL CHIP ATTACK': //NEFARIOUS CHIP ATTACK
      text = user.name() + ' charges into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EVIL CHIP NOTHING': //NEFARIOUS CHIP NOTHING
      text = user.name() + ' strokes his evil\r\n';
      text += 'moustache!';
      break;


    case 'EVIL LAUGH': //NEFARIOUS LAUGH
      text = user.name() + ' laughs like the evil\r\n';
      text += 'villain he is!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " feels HAPPY!"}
      else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
      break;

    case 'EVIL COOKIES': //NEFARIOUS COOKIES
      text = user.name() + ' throws OATMEAL COOKIES at everyone!\r\n';
      text += 'How evil!';
      break;

    //BISCUIT AND DOUGHIE//
    case 'BD ATTACK': //BISCUIT AND DOUGHIE ATTACK
      text = user.name() + ' attack together!\r\n';
      text += hpDamageText;
      break;

    case 'BD NOTHING': //BISCUIT AND DOUGHIE NOTHING
      text = user.name() + ' forget something\r\n';
      text += 'in the oven!';
      break;

    case 'BD BAKE BREAD': //BISCUIT AND DOUGHIE BAKE BREAD
      text = user.name() + ' pull out some\r\n';
      text += 'BREAD from the oven!';
      break;

    case 'BD COOK': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' makes a cookie!\r\n';
      text += `${target.name()} recovers ${Math.abs(hpDam)}\r\nHEART!`
      break;

    case 'BD CHEER UP': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' do their best to not\r\n';
      text += 'be SAD.';
      break;

    //KING CRAWLER//
    case 'KC ATTACK': //KING CRAWLER ATTACK
      text = user.name() + ' slams into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC NOTHING': //KING CRAWLER NOTHING
      text = user.name() + ' lets out an ear-piercing\r\n';
      text += 'screech!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + " feels ANGRY!";
      }
      else {text += parseNoEffectEmotion(target.name(), "ANGRIER!")}
      break;

    case 'KC CONSUME': //KING CRAWLER CONSUME
      text = user.name() + ' ate a\r\n';
      text += "LOST SPROUT MOLE!\r\n"
      text += `${target.name()} recovers ${Math.abs(hpDam)} HEART!\r\n`;
      break;

    case 'KC RECOVER': //KING CRAWLER CONSUME
      text = `${target.name()} recovers ${Math.abs(hpDam)} HEART!\r\n`;
      if(!target._noEffectMessage) {text += target.name() + " feels HAPPY!"}
      else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
      break;

    case 'KC CRUNCH': //KING CRAWLER CRUNCH
      text = user.name() + ' chomps ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC RAM': //KING CRAWLER RAM
      text = user.name() + ' runs though the party!\r\n';
      text += hpDamageText;
      break;

    //KING CARNIVORE//

    case "SWEET GAS":
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " releases gas!\r\n";
        text += "It smells sweet!\r\n";
        text += "Everyone feels HAPPY!";
      }
      target._noEffectMessage = undefined;
      break;

    //SPROUTMOLE LADDER//
    case 'SML NOTHING': //SPROUT MOLE LADDER NOTHING
      text = user.name() + ' stands firmly in place. ';
      break;

    case 'SML SUMMON MOLE': //SPROUT MOLE LADDER SUMMON SPROUT MOLE
      text = 'A SPROUT MOLE climbs up ' + user.name() + '!';
      break;

    case 'SML REPAIR': //SPROUT MOLE LADDER REPAIR
      text = user.name() + ' was repaired.';
      break;

    //UGLY PLANT CREATURE//
    case 'UPC ATTACK': //UGLY PLANT CREATURE ATTACK
      text = user.name() + ' wraps\r\n';
      text += target.name() + ' with vines!\r\n';
      text += hpDamageText;
      break;

    case 'UPC NOTHING': //UGLY PLANT CRATURE NOTHING
      text = user.name() + ' roars!';
      break;

    //ROOTS//
    case 'ROOTS NOTHING': //ROOTS NOTHING
      text = user.name() + ' wiggles around.';
      break;

    case 'ROOTS HEAL': //ROOTS HEAL
      text = user.name() + ' provides nutrients for\r\n';
      text += target.name() + '.';
      break;

    //BANDITO MOLE//
    case 'BANDITO ATTACK': //BANDITO ATTACK
      text = user.name() + ' cuts ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BANDITO STEAL': //BANDITO STEAL
      text = user.name() + ' swiftly steals an item from\r\n';
      text += 'the party!'
      break;

    case 'B.E.D.': //B.E.D.
      text = user.name() + ' pulls out the B.E.D.!\r\n';
      text += hpDamageText;
      break;

    //SIR MAXIMUS//
    case 'MAX ATTACK': //SIR MAXIMUS ATTACK
      text = user.name() + ' swings his sword!\r\n';
      text += hpDamageText;
      break;

    case 'MAX NOTHING': //SIR MAXIMUS NOTHING
      text = user.name() + ' pulled his back...\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' feels SAD.'
      }
      else {text += parseNoEffectEmotion(target.name(), "SADDER!")}
      break;

    case 'MAX STRIKE': //SIR MAXIMUS SWIFT STRIKE
      text = user.name() + ' strikes twice!';
      break;

    case 'MAX ULTIMATE ATTACK': //SIR MAXIMUS ULTIMATE ATTACK
      text = '"NOW FOR MY ULTIMATE ATTACK!"';
      text += hpDamageText;
      break;

    case 'MAX SPIN': //SIR MAXIMUS SPIN
        break;

    //SIR MAXIMUS II//
    case 'MAX 2 NOTHING': //SIR MAXIMUS II NOTHING
      text = user.name() + ' remembers his\r\n';
      text += 'father\'s dying words.\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' feels SAD.'
      }
      else {text += parseNoEffectEmotion(target.name(), "SADDER!")}
      break;

    //SIR MAXIMUS III//
    case 'MAX 3 NOTHING': //SIR MAXIMUS III NOTHING
      text = user.name() + ' remembers his\r\n';
      text += 'grandfather\'s dying words.\r\n';
      text += target.name() + ' feels SAD.'
      break;

    //SWEETHEART//
    case 'SH ATTACK': //SWEET HEART ATTACK
      text = user.name() + ' slaps ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SH INSULT': //SWEET HEART INSULT
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " insults everyone!\r\n"
        text += "Everyone feels ANGRY!\r\n";
      }
      text += hpDamageText;
      target._noEffectMessage = undefined;
      break;

    case 'SH SNACK': //SWEET HEART SNACK
      text = user.name() + ' orders a servant to bring her\r\n';
      text += 'a SNACK.\r\n';
      text += hpDamageText;
      break;

    case 'SH SWING MACE': //SWEET HEART SWING MACE
      text = user.name() + ' swings her mace with fervor!\r\n';
      text += hpDamageText;
      break;

    case 'SH BRAG': //SWEET HEART BRAG
      text = user.name() + ' boasts about\r\n';
      text += 'one of her many, many talents!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!';}
      }
      else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}

      break;

      //MR. JAWSUM //
      case 'DESK SUMMON MINION': //MR. JAWSUM DESK SUMMON MINION
        text = user.name() + ' picks up the phone and\r\n';
        text += 'calls a GATOR GUY!';
        break;

      case 'JAWSUM ATTACK ORDER': //MR. JAWSUM DESK ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' gives orders to attack!\r\n';
          text += "Everyone feels ANGRY!";
        }
        break;

      case 'DESK NOTHING': //MR. JAWSUM DESK DO NOTHING
        text = user.name() + ' begins counting CLAMS.';
        break;

      //PLUTO EXPANDED//
      case 'EXPANDED ATTACK': //PLUTO EXPANDED ATTACK
        text = user.name() + ' throws the Moon at\r\n';
        text += target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED SUBMISSION HOLD': //PLUTO EXPANDED SUBMISSION HOLD
        text = user.name() + ' puts ' + target.name() + '\r\n';
        text += 'in a submission hold!\r\n';
        text += target.name() + '\'s SPEED fell.\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED HEADBUTT': //PLUTO EXPANDED HEADBUTT
        text = user.name() + ' slams his head\r\n';
        text += 'into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED FLEX COUNTER': //PLUTO EXPANDED FLEX COUNTER
        text = user.name() + ' flexes his muscles and\r\n'
        text += 'prepares himself!';
        break;

      case 'EXPANDED EXPAND FURTHER': //PLUTO EXPANDED EXPAND FURTHER
        text = user.name() + ' expands even further!\r\n';
        if(!target._noStateMessage) {
          text += target.name() + '\'s ATTACK rose!\r\n';
          text += target.name() + '\'s DEFENSE rose!\r\n';
          text += target.name() + '\'s SPEED fell.';
        }
        else {
          text += parseNoStateChange(user.name(), "ATTACK", "higher!\r\n")
          text += parseNoStateChange(user.name(), "DEFENSE", "higher!\r\n")
          text += parseNoStateChange(user.name(), "SPEED", "lower!")
        }
        break;

      case 'EXPANDED EARTH SLAM': //PLUTO EXPANDED EARTH SLAM
        text = user.name() + ' picks up the Earth\r\n';
        text += 'and slams it into eveyone!';
        break;

      case 'EXPANDED ADMIRATION': //PLUTO EXPANDED ADMIRATION
        text = user.name() + ' is admiring KEL\'s progress!\r\n';
        if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!';}
        break;

      //ABBI TENTACLE//
      case 'TENTACLE ATTACK': //ABBI TENTACLE ATTACK
        text = user.name() + ' slams ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'TENTACLE TICKLE': //ABBI TENTACLE TICKLE
        text = user.name() + " weakens " + target.name() + "!\r\n";
        var pronumn = target.name() === "AUBREY" ? "her" : "his";
        text += `${target.name()} let ${pronumn} guard down!`
        break;

      case 'TENTACLE GRAB': //ABBI TENTACLE GRAB
        text = user.name() + ' wraps around ' + target.name() + '!\r\n';
        if(result.isHit()) {
          if(target.name() !== "OMORI" && !target._noEffectMessage) {text += target.name() + " feels AFRAID.\r\n";}
          else {text += parseNoEffectEmotion(target.name(), "AFRAID")}
        }
        text += hpDamageText;
        break;

      case 'TENTACLE GOOP': //ABBI TENTACLE GOOP
        text = target.name() + ' is drenched in dark liquid!\r\n';
        text += target.name() + ' feels weaker...\r\n';
        text += target.name() + '\'s ATTACK fell.\r\n';
        text += target.name() + '\'s DEFENSE fell.\r\n';
        text += target.name() + '\'s SPEED fell.';
        break;

      //ABBI//
      case 'ABBI ATTACK': //ABBI ATTACK
        text = user.name() + ' attacks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ABBI REVIVE TENTACLE': //ABBI REVIVE TENTACLE
        text = user.name() + ' focuses her HEART.';
        break;

      case 'ABBI VANISH': //ABBI VANISH
        text = user.name() + ' vanishes into the shadows...';
        break;

      case 'ABBI ATTACK ORDER': //ABBI ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' stretches her tentacles.\r\n';
          text += "Everyone's ATTACK rose!!\r\n"
          text += "Everyone feels ANGRY!"
        }
        break;

      case 'ABBI COUNTER TENTACLE': //ABBI COUNTER TENTACLES
        text = user.name() + ' moves through the shadows...';
        break;

      //ROBO HEART//
      case 'ROBO HEART ATTACK': //ROBO HEART ATTACK
        text = user.name() + ' fires rocket hands!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART NOTHING': //ROBO HEART NOTHING
        text = user.name() + ' is buffering...';
        break;

      case 'ROBO HEART LASER': //ROBO HEART LASER
        text = user.name() + ' opens her mouth and\r\n';
        text += 'fires a laser!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART EXPLOSION': //ROBO HEART EXPLOSION
        text = user.name() + ' sheds a single robot tear.\r\n';
        text += user.name() + ' explodes!';
        break;

      case 'ROBO HEART SNACK': //ROBO HEART SNACK
        text = user.name() + ' opens her mouth.\r\n';
        text += 'A nutritious SNACK appears!\r\n';
        text += hpDamageText;
        break;

      //MUTANT HEART//
      case 'MUTANT HEART ATTACK': //MUTANT HEART ATTACK
        text = user.name() + ' sings a song for ' + target.name() + '!\r\n';
        text += 'It was not the best...\r\n';
        text += hpDamageText;
        break;

      case 'MUTANT HEART NOTHING': //MUTANT HEART NOTHING
        text = user.name() + ' strikes a pose!';
        break;

      case 'MUTANT HEART HEAL': //MUTANT HEART HEAL
        text = user.name() + ' fixes her dress!';
        text += hpDamageText;
        break;

      case 'MUTANT HEART WINK': //MUTANT HEART WINK
        text = user.name() + ' winks at ' + target.name() + '!\r\n';
        text += 'It was kind of cute...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels HAPPY!';}
        else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
        break;

      case 'MUTANT HEART INSULT': //MUTANT HEART INSULT
        text = user.name() + ' accidently says something\r\n';
        text += 'mean.\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels ANGRY!';}
        else {text += parseNoEffectEmotion(target.name(), "ANGRIER!")}
        break;

      case 'MUTANT HEART KILL': //MUTANT HEART KILL
        text = 'MUTANTHEART slaps ' + user.name() +'!\r\n';
        text += hpDamageText;
        break;

        //PERFECT HEART//
        case 'PERFECT STEAL HEART': //PERFECT HEART STEAL HEART
          text = user.name() + ' steals ' + target.name() + '\'s\r\n';
          text += 'HEART.\r\n';
          text += hpDamageText + "\r\n";
          if(user.result().hpDamage < 0) {text += `${user.name()} recovers ${Math.abs(user.result().hpDamage)} HEART!\r\n`}
          break;

        case 'PERFECT STEAL BREATH': //PERFECT HEART STEAL BREATH
          text = user.name() + ' steals ' + target.name() + '\'s\r\n';
          text += 'breath away.\r\n';
          text += mpDamageText + "\r\n";
          if(user.result().mpDamage < 0) {text += `${user.name()} recovers ${Math.abs(user.result().mpDamage)} JUICE...\r\n`}
          break;

        case 'PERFECT EXPLOIT EMOTION': //PERFECT HEART EXPLOIT EMOTION
          text = user.name() + ' exploits ' + target.name() + '\'s\r\n';
          text += 'EMOTIONS!\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT SPARE': //PERFECT SPARE
          text = user.name() + ' decides to let\r\n';
          text += target.name() + ' live.\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT ANGELIC VOICE': //UPLIFTING HYMN
          if(target.index() <= unitLowestIndex) {
            text = user.name() + ' sings a soulful song...\r\n';
            if(!user._noEffectMessage) {text += user.name() + " feels SAD.\r\n"}
            else {text += parseNoEffectEmotion(user.name(), "SADDER!\r\n")}
            text += 'Everyone feels HAPPY!';
          }
          break;

        case "PERFECT ANGELIC WRATH":
          if(target.index() <= unitLowestIndex) {text = user.name() + " unleashes her wrath.\r\n";}
          if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels DEPRESSED..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels SAD.\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels FURIOUS!!!\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels ENRAGED!!\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels ANGRY!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion(target.name(), "HAPPIER!\r\n")}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion(target.name(), "SADDER!\r\n")}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion(target.name(), "ANGRIER!\r\n")}
          }
          text += hpDamageText;
          break;

        //SLIME GIRLS//
        case 'SLIME GIRLS COMBO ATTACK': //SLIME GIRLS COMBO ATTACK
          text = 'The ' + user.name() + ' attack all at once!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS DO NOTHING': //SLIME GIRLS DO NOTHING
          text = 'MEDUSA throws a bottle...\r\n';
          text += 'But nothing happened...';
          break;

        case 'SLIME GIRLS STRANGE GAS': //SLIME GIRLS STRANGE GAS
            if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels DEPRESSED..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels SAD.\r\n';}
              else if(target.isStateAffected(16)) {text += target.name() + ' feels FURIOUS!!!\r\n';}
              else if(target.isStateAffected(15)) {text += target.name() + ' feels ENRAGED!!\r\n';}
              else if(target.isStateAffected(14)) {text += target.name() + ' feels ANGRY!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion(target.name(), "HAPPIER!\r\n")}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion(target.name(), "SADDER!\r\n")}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion(target.name(), "ANGRIER!\r\n")}
          }
          break;

        case 'SLIME GIRLS DYNAMITE': //SLIME GIRLS DYNAMITE
          //text = 'MEDUSA threw a bottle...\r\n';
          //text += 'And it explodes!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS STING RAY': //SLIME GIRLS STING RAY
          text = 'MOLLY fires her stingers!\r\n';
          text += target.name() + ' gets struck!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS SWAP': //SLIME GIRLS SWAP
          text = 'MEDUSA does the thing!\r\n';
          text += 'Your HEART and JUICE are switched!';
          break;

        case 'SLIME GIRLS CHAIN SAW': //SLIME GIRLS CHAIN SAW
          text = 'MARINA pulls out a chainsaw!\r\n';
          text += hpDamageText;
          break;

      //HUMPHREY SWARM//
      case 'H SWARM ATTACK': //HUMPHREY SWARM ATTACK
        text = 'HUMPHREY surrounds and attacks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY LARGE//
      case 'H LARGE ATTACK': //HUMPHREY LARGE ATTACK
        text = 'HUMPHREY slams into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY FACE//
      case 'H FACE CHOMP': //HUMPHREY FACE CHOMP
        text = 'HUMPHREY sinks his teeth into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'H FACE DO NOTHING': //HUMPHREY FACE DO NOTHING
        text = 'HUMPHREY stares at ' + target.name() + '!\r\n';
        text += 'HUMPHREY\'s mouth waters incessantly.';
        break;

      case 'H FACE HEAL': //HUMPHREY FACE HEAL
        text = 'HUMPHREY swallows a foe!\r\n';
        text += `HUMPHREY recovers ${Math.abs(hpDam)} HEART!`
        break;

      //HUMPHREY UVULA//
      case 'UVULA DO NOTHING 1': //HUMPHREY UVULA DO NOTHING
        text = user.name() + ' smirks at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 2': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' winks at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 3': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' spits on ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 4': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' stares at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 5': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' blinks at ' + target.name() + '.\r\n';
      break;

      //FEAR OF FALLING//
      case 'DARK NOTHING': //SOMETHING IN THE DARK NOTHING
        text = user.name() + ' taunts ' + target.name() + '\r\n';
        text += 'as he falls.';
        break;

      case 'DARK ATTACK': //SOMETHING IN THE DARK ATTACK
        text = user.name() + ' shoves ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      //FEAR OF BUGS//
      case 'BUGS ATTACK': //FEAR OF BUGS ATTACK
        text = user.name() + ' bites ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BUGS NOTHING': //FEAR OF BUGS NOTHING
        text = user.name() + ' is trying to talk to you...';
        break;

      case 'SUMMON BABY SPIDER': //SUMMON BABY SPIDER
        text = 'A spider egg hatches\r\n';
        text += 'A BABY SPIDER appeared.';
        break;

      case 'BUGS SPIDER WEBS': //FEAR OF BUGS SPIDER WEBS
        text = user.name() + ' entangles ' + target.name() + '\r\n';
        text += 'in sticky webs.\r\n';
        text += target.name() + '\'s SPEED fell!\r\n';
        break;

      //BABY SPIDER//
      case 'BABY SPIDER ATTACK': //BABY SPIDER ATTACK
        text = user.name() + ' bites ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BABY SPIDER NOTHING': //BABY SPIDER NOTHING
        text = user.name() + ' makes a strange noise.';
        break;

      //FEAR OF DROWNING//
      case 'DROWNING ATTACK': //FEAR OF DROWNING ATTACK
        text = 'Water pulls ' + target.name() + ' in different\r\n';
        text += 'directions.\r\n';
        text += hpDamageText;
        break;

      case 'DROWNING NOTHING': //FEAR OF DROWNING NOTHING
        text = user.name() + ' listens to ' + target.name() + " struggle.";
        break;

      case 'DROWNING DRAG DOWN': //FEAR OF DROWNING DRAG DOWN
        // text = user.name() + ' grabs\r\n';
        // text += target.name() + '\s leg and drags him down!\r\n';
        text = hpDamageText;
        break;

      //OMORI'S SOMETHING//
      case 'O SOMETHING ATTACK': //OMORI SOMETHING ATTACK
        text = user.name() + ' reaches through ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'O SOMETHING NOTHING': //OMORI SOMETHING NOTHING
        text = user.name() + ' sees through ' + target.name() + '.\r\n';
        break;

      case 'O SOMETHING BLACK SPACE': //OMORI SOMETHING BLACK SPACE
        //text = user.name() + ' drags ' + target.name() + ' into\r\n';
        //text += 'the shadows.';
        text = hpDamageText;
        break;

      case 'O SOMETHING SUMMON': //OMORI SOMETHING SUMMON SOMETHING
        text = user.name() + ' calls something from\r\n';
        text += 'the darkness.';
        break;

      case 'O SOMETHING RANDOM EMOTION': //OMORI SOMETHING RANDOM EMOTION
        text = user.name() + ' plays with ' + target.name() +'\'s EMOTIONS.';
        break;

      //BLURRY IMAGE//
      case 'BLURRY NOTHING': //BLURRY IMAGE NOTHING
        text = 'SOMETHING sways in the wind.';
        break;

      //HANGING BODY//
      case 'HANG WARNING':
          text = 'You feel a chill run down your spine.';
          break;

      case 'HANG NOTHING 1':
          text = 'You feel dizzy.';
          break;

      case 'HANG NOTHING 2':
          text = 'You feel your lungs tighten up.';
          break;

      case 'HANG NOTHING 3':
          text = 'You feel a sinking sensation in your\r\n';
          text += 'stomach.';
          break;

      case 'HANG NOTHING 4':
          text = 'You feel your heart beating out of\r\n';
          text += 'your chest.';
          break;

      case 'HANG NOTHING 5':
          text = 'You feel yourself trembling.';
          break;

      case 'HANG NOTHING 6':
          text = 'You feel your knees weaken.';
          break;

      case 'HANG NOTHING 7':
          text = 'You feel sweat dripping down your\r\n';
          text += 'forehead.';
          break;

      case 'HANG NOTHING 8':
          text = 'You feel your fist clenching on its own.';
          break;

      case 'HANG NOTHING 9':
          text = 'You hear your heart beating.';
          break;

      case 'HANG NOTHING 10':
          text = 'You hear your heart begin to steady.';
          break;

      case 'HANG NOTHING 11':
          text = 'You hear your breathing begin to steady.';
          break;

      case 'HANG NOTHING 12':
          text = 'You focus on what is straight\r\n';
          text += 'in front of you.';
          break;

      //AUBREY//
      case 'AUBREY NOTHING': //AUBREY NOTHING
        text = user.name() + ' spits on your shoe.';
        break;

      case 'AUBREY TAUNT': //AUBREY TAUNT
        text = user.name() + ' calls ' + target.name() + ' weak!\r\n';
        text += target.name() + " feels ANGRY!";
        break;

      //THE HOOLIGANS//
      case 'CHARLIE ATTACK': //HOOLIGANS CHARLIE ATTACK
        text = 'CHARLIE puts her all into an attack!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL ATTACK': //HOOLIGANS ANGEL ATTACK
        text = 'ANGEL swiftly strikes ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK CHARM': //HOOLIGANS MAVERICK CHARM
        text = 'THE MAVERICK winks at ' + target.name() + '!\r\n';
        text += target.name() + '\'s ATTACK fell.'
        break;

      case 'KIM HEADBUTT': //HOOLIGANS KIM HEADBUTT
        text = 'KIM slams her head into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE CANDY': //HOOLIGANS VANCE CANDY
        text = 'VANCE throws candy!\r\n';
        text += hpDamageText;
        break;

      case 'HOOLIGANS GROUP ATTACK': //THE HOOLIGANS GROUP ATTACK
        text = user.name() + ' go all out!\r\n';
        text += hpDamageText;
        break;

      //BASIL//
      case 'BASIL ATTACK': //BASIL ATTACK
        text = user.name() + ' reaches inside ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'BASIL NOTHING': //BASIL NOTHING
        text = user.name() + '\'s eyes are red from crying.';
        break;

      case 'BASIL PREMPTIVE STRIKE': //BASIL PREMPTIVE STRIKE
        text = user.name() + ' slices ' + target.name() +'\'s arm.\r\n';
        text += hpDamageText;
        break;

      //BASIL'S SOMETHING//
      case 'B SOMETHING ATTACK': //BASIL'S SOMETHING ATTACK
        text = user.name() + ' strangles ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B SOMETHING TAUNT': //BASIL'S SOMETHING TAUNT BASIL
        text = user.name() + ' reaches inside ' + target.name() + '.\r\n';
        break;

      //PLAYER SOMETHING BASIL FIGHT//
      case 'B PLAYER SOMETHING STRESS': //B PLAYER SOMETHING STRESS
        text = user.name() + ' does something to\r\n';
        text += target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B PLAYER SOMETHING HEAL': //B PLAYER SOMETHING HEAL
        text = user.name() + ' seeps into ' + target.name() + '\'s wounds.\r\n';
        text += hpDamageText;
        break;

      case 'B OMORI SOMETHING CONSUME EMOTION': //B OMORI SOMETHING CONSUME EMOTION
        text = user.name() + ' consumes ' + target.name() + '\'s EMOTIONS.';
        break;

      //CHARLIE//
      case 'CHARLIE RELUCTANT ATTACK': //CHARLIE RELUCTANT ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CHARLIE NOTHING': //CHARLIE NOTHING
        text = user.name() + ' is standing there.';
        break;

      case 'CHARLIE LEAVE': //CHARLIE LEAVE
        text = user.name() + ' stops fighting.';
        break;

      //ANGEL//
      case 'ANGEL ATTACK': //ANGEL ATTACK
        text = user.name() + ' swiftly kicks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL NOTHING': //ANGEL NOTHING
        text = user.name() + ' does a flip and strikes a pose!';
        break;

      case 'ANGEL QUICK ATTACK': //ANGEL QUICK ATTACK
        text = user.name() + ' teleports behind ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL TEASE': //ANGEL TEASE
        text = user.name() + ' says mean things about ' + target.name() + '!';
        break;

      //THE MAVERICK//
      case 'MAVERICK ATTACK': //THE MAVERICK ATTACK
        text = user.name() + ' hits ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK NOTHING': //THE MAVERICK NOTHING
        text = user.name() + ' starts bragging to\r\n';
        text += 'his adoring fans!';
        break;

      case 'MAVERICK SMILE': //THE MAVERICK SMILE
        text = user.name() + ' smiles seductively!\r\n';
        text += target.name() + '\'s ATTACK fell.';
        break;

      case 'MAVERICK TAUNT': //THE MAVERICK TAUNT
        text = user.name() + ' starts making fun of\r\n';
        text += target.name() + '!\r\n';
        text += target.name() + " feels ANGRY!"
        break;

      //KIM//
      case 'KIM ATTACK': //KIM ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'KIM NOTHING': //KIM DO NOTHING
        text = user.name() + '\'s phone rang...\r\n';
        text += 'It was a wrong number.';
        break;

      case 'KIM SMASH': //KIM SMASH
        text = user.name() + ' grabs ' + target.name() + '\'s shirt and\r\n';
        text += 'punches them in the face!\r\n';
        text += hpDamageText;
        break;

      case 'KIM TAUNT': //KIM TAUNT
        text = user.name() + ' starts making fun of ' + target.name() + '!\r\n';
        text += target.name() + " feels SAD.";
        break;

      //VANCE//
      case 'VANCE ATTACK': //VANCE ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE NOTHING': //VANCE NOTHING
        text = user.name() + ' scratches his belly.';
        break;

      case 'VANCE CANDY': //VANCE CANDY
        text = user.name() + ' throws old candy at ' + target.name() + '!\r\n';
        text += 'Ewww... It\'s sticky...\r\n';
        text += hpDamageText;
        break;

      case 'VANCE TEASE': //VANCE TEASE
        text = user.name() + ' said mean things about ' + target.name() + '!\r\n';
        text += target.name() + " feels SAD."
        break;

      //JACKSON//
      case 'JACKSON WALK SLOWLY': //JACKSON WALK SLOWLY
        text = user.name() + ' slowly inches forward...\r\n';
        text += 'You feel like you can\'t escape!';
        break;

      case 'JACKSON KILL': //JACKSON AUTO KILL
        text = user.name() + ' CAUGHT YOU!!!\r\n';
        text += 'You see your life flash before your eyes!';
        break;

      //RECYCLEPATH//
      case 'R PATH ATTACK': //RECYCLEPATH ATTACK
        text = user.name() + ' hits ' + target.name() + ' with a bag!\r\n';
        text += hpDamageText;
        break;

      case 'R PATH SUMMON MINION': //RECYCLEPATH SUMMON MINION
        text = user.name() + ' calls a follower!\r\n';
        text += 'A RECYCULTIST appeared!';
        break;

      case 'R PATH FLING TRASH': //RECYCLEPATH FLING TRASH
        text = user.name() + ' flings all their TRASH\r\n';
        text += 'at ' + target.name() + '!\r\n'
        text += hpDamageText;
        break;

      case 'R PATH GATHER TRASH': //RECYCLEPATH GATHER TRASH
        text = user.name() + ' picks up some TRASH!';
        break;

    //SOMETHING IN THE CLOSET//
      case 'CLOSET ATTACK': //SOMETHING IN THE CLOSET ATTACK
        text = user.name() + ' drags ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CLOSET NOTHING': //SOMETHING IN THE CLOSET DO NOTHING
        text = user.name() + ' mutters eerily.';
        break;

      case 'CLOSET MAKE AFRAID': //SOMETHING IN THE CLOSET MAKE AFRAID
        text = user.name() + ' knows your secret!';
        break;

      case 'CLOSET MAKE WEAK': //SOMETHING IN THE CLOSET MAKE WEAK
        text = user.name() + ' saps ' + target.name() + '\'s will to live!';
        break;

    //BIG STRONG TREE//
      case 'BST SWAY': //BIG STRONG TREE NOTHING 1
        text = 'Uma brisa suave balança as folhas.';
        break;

      case 'BST NOTHING': //BIG STRONG TREE NOTHING 2
        text = user.name() + ' permanece imóvel\r\n';
        text += 'porque é uma árvore.';
        break;

    //DREAMWORLD FEAR EXTRA BATTLES//
    //HEIGHTS//
    case 'DREAM HEIGHTS ATTACK': //DREAM FEAR OF HEIGHTS ATTACK
      text = user.name() + ' strikes ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'DREAM HEIGHTS GRAB': //DREAM FEAR OF HEIGHTS GRAB
      if(target.index() <= unitLowestIndex) {
        text = 'Hands appear and grab everyone!\r\n';
        text += 'Everyone' + '\'s ATTACK fell...';
      }

      break;

    case 'DREAM HEIGHTS HANDS': //DREAM FEAR OF HEIGHTS HANDS
      text = 'More hands appear and surround\r\n';
      text += user.name() + '.\r\n';
      if(!target._noStateMessage) {text += user.name() + '\'s DEFENSE rose!';}
      else {text += parseNoStateChange(user.name(), "DEFENSE", "higher!")}
      break;

    case 'DREAM HEIGHTS SHOVE': //DREAM FEAR OF HEIGHTS SHOVE
      text = user.name() + ' shoves ' + target.name() + '.\r\n';
      text += hpDamageText + '\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI"){text += target.name() + ' feels AFRAID.';}
      else {text += parseNoEffectEmotion(target.name(), "AFRAID")}
      break;

    case 'DREAM HEIGHTS RELEASE ANGER': //DREAM FEAR OF HEIGHTS RELEASE ANGER
      text = user.name() + ' takes its ANGER out on everyone!';
      break;

    //SPIDERS//
    case 'DREAM SPIDERS CONSUME': //DREAM FEAR OF SPIDERS CONSUME
      text = user.name() + ' wraps up and eats ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    //DROWNING//
    case 'DREAM DROWNING SMALL': //DREAM FEAR OF DROWNING SMALL
      text = 'Everyone is having a hard time breathing.';
      break;

    case 'DREAM DROWNING BIG': //DREAM FEAR OF DROWNING BIG
      text = 'Everyone feels like passing out.';
      break;

    // BLACK SPACE EXTRA //
    case 'BS LIAR': // BLACK SPACE LIAR
      text = 'Liar.';
      break;

    //BACKGROUND ACTORS//
    //BERLY//
      case 'BERLY ATTACK': //BERLY ATTACK
        text = 'BERLY headbutts ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BERLY NOTHING 1': //BERLY NOTHING 1
        text = 'BERLY is bravely hiding in the corner.';
        break;

      case 'BERLY NOTHING 2': //BERLY NOTHING 2
        text = 'BERLY fixes her glasses.';
        break;

      //TOYS//
      case 'CAN':  // CAN
        text = user.name() + ' kicks the CAN.';
        break;

      case 'DANDELION':  // DANDELION
        text = user.name() + ' blows on the DANDELION.\r\n';
        text += user.name() + ' feels like ' + (switches.value(6) ? 'her' : 'his') + 'self again.';
        break;

      case 'DYNAMITE':  // DYNAMITE
        text = user.name() + ' throws DYNAMITE!';
        break;

      case 'LIFE JAM':  // LIFE JAM
        text = user.name() + ' uses LIFE JAM on TOAST!\r\n';
        text += 'TOAST became ' + target.name() + '!';
        break;

      case 'PRESENT':  // PRESENT
        text = target.name() + ' opens the PRESENT\r\n';
        text += 'It wasn\'t what ' + target.name() + ' wanted...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels ANGRY! ';}
        else {text += parseNoEffectEmotion(target.name(), "ANGRIER!")}
        break;

      case 'SILLY STRING':  // DYNAMITE
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' uses SILLY STRING!\r\n';
          text += 'WOOOOO!! It\'s a party!\r\n';
          text += 'Everyone feels HAPPY! ';
        }
        break;

      case 'SPARKLER':  // SPARKLER
        text = user.name() + ' lights the SPARKLER!\r\n';
        text += 'WOOOOO!! It\'s a party!\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels HAPPY!';}
        else {text += parseNoEffectEmotion(target.name(), "HAPPIER!")}
        break;

      case 'COFFEE': // COFFEE
        text = user.name() + ' drinks the COFFEE...\r\n';
        text += user.name() + ' feels amazing!';
        break;

      case 'RUBBERBAND': // RUBBERBAND
        text = user.name() + ' flicks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //OMORI BATTLE//

      case "OMORI ERASES":
        text = user.name() + " erases the enemy.\r\n";
        text += hpDamageText;
        break;

      case "MARI ATTACK":
        text = user.name() + " erases the enemy.\r\n";
        text += target.name() + " feels AFRAID.\r\n";
        text += hpDamageText;
        break;

      //STATES//
      case 'HAPPY':
        if(!target._noEffectMessage){text = target.name() + ' se sentiu FELIZ!';}
        else {text = parseNoEffectEmotion(target.name(), "mais FELIZ!")}
        break;

      case 'ECSTATIC':
        if(!target._noEffectMessage){text = target.name() + ` se sentiu EXTÁTIC${pronome1}!!`;}
        else {text = parseNoEffectEmotion(target.name(), "mais FELIZ!")}
        break;

      case 'MANIC':
        if(!target._noEffectMessage){text = target.name() + ' se sentiu MANÍACO!!!';}
        else {text = parseNoEffectEmotion(target.name(), "mais FELIZ!")}
        break;

      case 'SAD':
        if(!target._noEffectMessage){text = target.name() + ' se sentiu TRISTE.';}
        else {text = parseNoEffectEmotion(target.name(), "mais TRISTE!")}
        break;

      case 'DEPRESSED':
        if(!target._noEffectMessage){text = target.name() + ` se sentiu DEPRIMID${pronome1}..`;}
        else {text = parseNoEffectEmotion(target.name(), "mais TRISTE!")}
        break;

      case 'MISERABLE':
        if(!target._noEffectMessage){text = target.name() + ' se sentiu MISERÁVEL...';}
        else {text = parseNoEffectEmotion(target.name(), "mais TRISTE!")}
        break;

      case 'ANGRY':
        if(!target._noEffectMessage){text = target.name() + ` se sentiu NERVOS${pronome1}!`;}
        else {text = parseNoEffectEmotion(target.name(), "mais NERVOSO!")}
        break;

      case 'ENRAGED':
        if(!target._noEffectMessage){text = target.name() + ` se sentiu ENFURECID${pronome1}!!`;}
        else {text = parseNoEffectEmotion(target.name(), "mais NERVOSO!")}
        break;

      case 'FURIOUS':
        if(!target._noEffectMessage){text = target.name() + ' se sentiu FURIOSO!!!'}
        else {text = parseNoEffectEmotion(target.name(), "mais NERVOSO!")}
        break;

      case 'AFRAID':
        if(!target._noEffectMessage){text = target.name() + ` se sentiu ASSUSTAD${pronome1}!`;}
        else {text = parseNoEffectEmotion(target.name(), "ASSUSTADO")}
        break;

      case 'CANNOT MOVE':
        text = target.name() + ` está IMOBILIZAD${pronome1}! `;
        break;

      case 'INFATUATION':
        text = target.name() + ` está IMOBILIZAD${pronome1} pelo amor! `;
        break;



  }
  // Return Text
  return text;
};
//=============================================================================
// * Display Custom Action Text
//=============================================================================
Window_BattleLog.prototype.displayCustomActionText = function(subject, target, item) {
  // Make Custom Action Text
  var text = this.makeCustomActionText(subject, target, item);
  // If Text Length is more than 0
  if (text.length > 0) {
    if(!!this._multiHitFlag && !!item.isRepeatingSkill) {return;}
    // Get Get
    text = text.split(/\r\n/);
    for (var i = 0; i < text.length; i++) { this.push('addText', text[i]); }
    // Add Wait
    this.push('wait', 15);

  }
  if(!!item.isRepeatingSkill) {this._multiHitFlag = true;}
};
//=============================================================================
// * Display Action
//=============================================================================
Window_BattleLog.prototype.displayAction = function(subject, item) {
  // Return if Item has Custom Battle Log Type
  if (item.meta.BattleLogType) { return; }
  // Run Original Function
  _TDS_.CustomBattleActionText.Window_BattleLog_displayAction.call(this, subject, item);
};
//=============================================================================
// * Display Action Results
//=============================================================================
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
  // Get Item Object
  var item = BattleManager._action._item.object();
  // If Item has custom battle log type
  if (item && item.meta.BattleLogType) {
    // Display Custom Action Text
    this.displayCustomActionText(subject, target, item);
    // Return
  }
  // Run Original Function
  else {
    _TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults.call(this, subject, target);
  }
};

const _old_window_battleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage
Window_BattleLog.prototype.displayHpDamage = function(target) {
  let result = target.result();
  if(result.isHit() && result.hpDamage > 0) {
    if(!!result.elementStrong) {
      this.push("addText","...Foi um ataque dinâmico!");
      this.push("waitForNewLine");
    }
    else if(!!result.elementWeak) {
      this.push("addText", "...Foi um ataque fraco!");
      this.push("waitForNewLine")
    }
  }
  return _old_window_battleLog_displayHpDamage.call(this, target)
};

//=============================================================================
// * CLEAR
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_endAction= Window_BattleLog.prototype.endAction;
Window_BattleLog.prototype.endAction = function() {
  _TDS_.CustomBattleActionText.Window_BattleLog_endAction.call(this);
  this._multiHitFlag = false;
};

//=============================================================================
// * DISPLAY ADDED STATES
//=============================================================================
