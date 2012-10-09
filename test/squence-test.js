"use strict";

var RuntimeTest = TestCase("RuntimeTest");

RuntimeTest.prototype.testSequence0 = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(0, commands.length);
};

RuntimeTest.prototype.testSequence1 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<fire><bulletRef label='bullet1'/></fire>"
            + "<fire><bulletRef label='bullet2'/></fire><wait>5</wait>"
            + "<vanish/></action>"
            + "<bullet label='bullet1'/><bullet label='bullet2'/></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(4, commands.length);
    assertEquals("fire", commands[0].commandName);
    assertEquals("fire", commands[1].commandName);
    assertEquals("wait", commands[2].commandName);
    assertEquals("vanish", commands[3].commandName);
};

RuntimeTest.prototype.testSequence2 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<action><fire><bulletRef label='bullet1'/></fire>"
            + "<fire><bulletRef label='bullet2'/></fire></action>"
            + "<action><wait>5</wait></action><vanish/></action>"
            + "<bullet label='bullet1'/><bullet label='bullet2'/></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(4, commands.length);
    assertEquals("fire", commands[0].commandName);
    assertEquals("fire", commands[1].commandName);
    assertEquals("wait", commands[2].commandName);
    assertEquals("vanish", commands[3].commandName);
};

RuntimeTest.prototype.testActionRef1 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<actionRef label='a' /></action>"
            + "<action label='a'><vanish/></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(1, commands.length);
    assertEquals("vanish", commands[0].commandName);
};

RuntimeTest.prototype.testActionRef2 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<actionRef label='a' /></action>"
            + "<action label='a'><vanish/><actionRef label='b'/></action>"
            + "<action label='b'><wait>50</wait></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(2, commands.length);
    assertEquals("vanish", commands[0].commandName);
    assertEquals("wait", commands[1].commandName);
};

RuntimeTest.prototype.testActionRef3 = function() {
    var bulletml = BulletML.build("<bulletml><bullet label='b'>"
            + "<action><wait>5</wait></action><actionRef label='a'/>"
            + "<action><vanish/></action></bullet>"
            + "<action label='a'><fire><bullet/></fire></action></bulletml>");
    var commands = bulletml.findBullet("b").sequence();
    assertEquals(3, commands.length);
    assertEquals("wait", commands[0].commandName);
    assertEquals("fire", commands[1].commandName);
    assertEquals("vanish", commands[2].commandName);
};

RuntimeTest.prototype.testRepeat = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>3</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
    assertEquals("loopStart", commands[0].commandName);
    assertEquals("vanish", commands[1].commandName);
    assertEquals("loopEnd", commands[2].commandName);
    assertEquals(commands[0], commands[2].start);
};

RuntimeTest.prototype.testRepeat2 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>3</times><actionRef label='v'/></repeat>"
            + "</action><action label='v'><vanish/></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
    assertEquals("loopStart", commands[0].commandName);
    assertEquals("vanish", commands[1].commandName);
    assertEquals("loopEnd", commands[2].commandName);
    assertEquals(3, commands[2].times);
};

RuntimeTest.prototype.testRepeatExp1 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>5+5</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
};

RuntimeTest.prototype.testRepeatExp2 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>3-1</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
};

RuntimeTest.prototype.testRepeatExp3 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>2*5</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
    assertEquals("2*5", commands[2].times);
};

RuntimeTest.prototype.testRepeatExp4 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>10/4</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
};

RuntimeTest.prototype.testRepeatExp5 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<repeat><times>47%3</times><action><vanish/></action></repeat>"
            + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(3, commands.length);
    assertEquals("47%3", commands[2].times);
};

RuntimeTest.prototype.testRepeatExp6 = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='r'><param>1</param></actionRef>"
                    + "<actionRef label='r'><param>2</param></actionRef>"
                    + "<actionRef label='r'><param>3</param></actionRef>"
                    + "</action>"
                    + "<action label='r'><repeat><times>$1</times><action><vanish/></action></repeat>"
                    + "</action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(9, commands.length);
    assertEquals("loopStart", commands[0].commandName);
    assertEquals("vanish", commands[1].commandName);
    assertEquals("loopEnd", commands[2].commandName);
    assertEquals("(1)", commands[2].times);
    assertEquals("loopStart", commands[3].commandName);
    assertEquals("vanish", commands[4].commandName);
    assertEquals("loopEnd", commands[5].commandName);
    assertEquals("(2)", commands[5].times);
    assertEquals("loopStart", commands[6].commandName);
    assertEquals("vanish", commands[7].commandName);
    assertEquals("loopEnd", commands[8].commandName);
    assertEquals("(3)", commands[8].times);
};

RuntimeTest.prototype.testRepeatExp7 = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='r'><param>1</param><param>2</param></actionRef>"
                    + "<actionRef label='r'><param>3</param><param>4</param></actionRef>"
                    + "</action>"
                    + "<action label='r'><actionRef label='r2'><param>$1*$2</param></actionRef></action>"
                    + "<action label='r2'><repeat><times>$1</times><action><vanish/></action></repeat></action>"
                    + "</bulletml>");
    var commands = bulletml.sequence();
    assertEquals(6, commands.length);
};

RuntimeTest.prototype.testChangeDirectionExp = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='r'><param>1</param><param>2</param></actionRef>"
                    + "<actionRef label='r'><param>3</param><param>4</param></actionRef>"
                    + "</action>"
                    + "<action label='r'><changeDirection><direction>$1</direction>"
                    + "<term>$2</term></changeDirection></action>"
                    + "</bulletml>");
    var commands = bulletml.sequence();
    assertEquals(2, commands.length);
    assertEquals("(1)", commands[0].direction.value);
    assertEquals("(2)", commands[0].term);
    assertEquals("(3)", commands[1].direction.value);
    assertEquals("(4)", commands[1].term);
};

RuntimeTest.prototype.testChangeSpeedExp = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='r'><param>1</param><param>2</param></actionRef>"
                    + "<actionRef label='r'><param>3</param><param>4</param></actionRef>"
                    + "</action>"
                    + "<action label='r'><changeSpeed><speed>$1</speed>"
                    + "<term>$2</term></changeSpeed></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(2, commands.length);
    assertEquals("(1)", commands[0].speed.value);
    assertEquals("(2)", commands[0].term);
    assertEquals("(3)", commands[1].speed.value);
    assertEquals("(4)", commands[1].term);
};

RuntimeTest.prototype.testAccelExp = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='r'><param>1</param><param>2</param><param>3</param></actionRef>"
                    + "<actionRef label='r'><param>4</param><param>5</param><param>6</param></actionRef>"
                    + "</action>"
                    + "<action label='r'><accel><horizontal>$1</horizontal><vertical>$2</vertical>"
                    + "<term>$3</term></accel></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(2, commands.length);
    assertEquals("(1)", commands[0].horizontal.value);
    assertEquals("(2)", commands[0].vertical.value);
    assertEquals("(3)", commands[0].term);
    assertEquals("(4)", commands[1].horizontal.value);
    assertEquals("(5)", commands[1].vertical.value);
    assertEquals("(6)", commands[1].term);
};

RuntimeTest.prototype.testWaitExp = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<actionRef label='r'><param>1</param></actionRef>"
            + "<actionRef label='r'><param>2</param></actionRef></action>"
            + "<action label='r'><wait>$1</wait></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(2, commands.length);
    assertEquals("(1)", commands[0].value);
    assertEquals("(2)", commands[1].value);
};

RuntimeTest.prototype.testFireBullet = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='s'>"
                    + "<param>1</param><param>2</param><param>3</param><param>4</param>"
                    + "</actionRef></action>"
                    + "<action label='s'><fire><direction>$1*10</direction><speed>$2*10</speed>"
                    + "<bullet><direction>$1*100</direction><speed>$2*100</speed></bullet></fire></action>"
                    + "</bulletml>");
    var commands = bulletml.sequence();
    assertEquals(1, commands.length);
    assertEquals("(1)*10", commands[0].direction.value);
    assertEquals("(2)*10", commands[0].speed.value);
    assertEquals("(1)*100", commands[0].bullet.direction.value);
    assertEquals("(2)*100", commands[0].bullet.speed.value);
};

RuntimeTest.prototype.testFireBulletRef = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'>"
                    + "<actionRef label='s'>"
                    + "<param>1</param><param>2</param><param>3</param><param>4</param>"
                    + "</actionRef></action>"
                    + "<action label='s'><fire><direction>$1*10</direction><speed>$2*10</speed>"
                    + "<bulletRef label='b'><param>$3*10</param><param>$4*10</param></bulletRef></fire></action>"
                    + "<bullet label='b'><direction>$1*10</direction><speed>$2*10</speed></bullet></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(1, commands.length);
    assertEquals("(1)*10", commands[0].direction.value);
    assertEquals("(2)*10", commands[0].speed.value);
    assertEquals("b", commands[0].bullet.label);
    assertEquals("((3)*10)*10", commands[0].bullet.direction.value);
    assertEquals("((4)*10)*10", commands[0].bullet.speed.value);
};

RuntimeTest.prototype.testBulletAction = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'><fire><bullet>"
                    + "<action><wait>5</wait></action>"
                    + "<action><vanish/></action></bullet></fire>"
                    + "</action></bulletml>");
    var commands = bulletml.sequence();
    var bullet = commands[0].bullet;
    var bulletCommands = bullet.sequence();
    assertEquals(2, bulletCommands.length);
    assertEquals("wait", bulletCommands[0].commandName);
    assertEquals("vanish", bulletCommands[1].commandName);
};

RuntimeTest.prototype.testBulletActionRef = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'><fire><bullet>"
                    + "<action><wait>5</wait></action>"
                    + "<actionRef label='a'/></bullet></fire></action>"
                    + "<action label='a'><vanish/></action></bulletml>");
    var commands = bulletml.sequence();
    var bullet = commands[0].bullet;
    var bulletCommands = bullet.sequence();
    assertEquals(2, bulletCommands.length);
    assertEquals("wait", bulletCommands[0].commandName);
    assertEquals("vanish", bulletCommands[1].commandName);
};

RuntimeTest.prototype.testBulletActionRef2 = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'><fire><bullet>"
                    + "<action><wait>5</wait></action>"
                    + "<actionRef label='a'><param>3</param></actionRef></bullet></fire></action>"
                    + "<action label='a'><wait>$1*10</wait></action></bulletml>");
    var commands = bulletml.sequence();
    var bullet = commands[0].bullet;
    var bulletCommands = bullet.sequence();
    assertEquals(2, bulletCommands.length);
    assertEquals("wait", bulletCommands[0].commandName);
    assertEquals("5", bulletCommands[0].value);
    assertEquals("wait", bulletCommands[1].commandName);
    assertEquals("(3)*10", bulletCommands[1].value);
};

RuntimeTest.prototype.testBulletActionRef3 = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'><fire>"
            + "<bulletRef label='b'><param>8</param></bulletRef>"
            + "</fire></action>"
            + "<bullet label='b'><action><wait>5</wait></action>"
            + "<actionRef label='a'><param>$1*2</param></actionRef></bullet>"
            + "<action label='a'><wait>$1*10</wait></action></bulletml>");
    var commands = bulletml.sequence();
    var bullet = commands[0].bullet;
    var bulletCommands = bullet.sequence();
    assertEquals(2, bulletCommands.length);
    assertEquals("wait", bulletCommands[0].commandName);
    assertEquals(5, bulletCommands[0].value);
    assertEquals("wait", bulletCommands[1].commandName);
    assertEquals("((8)*2)*10", bulletCommands[1].value);
};

RuntimeTest.prototype.testFireRef = function() {
    var bulletml = BulletML.build("<bulletml><action label='top'>"
            + "<fireRef label='f'><param>5</param></fireRef></action>"
            + "<fire label='f'><speed>5</speed><bullet/></fire></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(1, commands.length);
    assertEquals("fire", commands[0].commandName);
    assertEquals(5, commands[0].speed.value);
};

RuntimeTest.prototype.testRepeatNestedActionRef = function() {
    var bulletml = BulletML.build("<bulletml>"
            + "<action label='top'><repeat><times>5</times><action>"
            + "<actionRef label='shot'/><actionRef label='shot'/>"
            + "</action></repeat></action>"
            + "<action label='shot'><vanish/></action></bulletml>");
    var commands = bulletml.sequence();
    assertEquals(4, commands.length);
};

RuntimeTest.prototype.testActionRefBullet = function() {
    var bulletml = BulletML
            .build("<bulletml>"
                    + "<action label='top'><actionRef label='sub'><param>5</param></actionRef></action>"
                    + "<action label='sub'><fire><bullet><action><wait>$1</wait></action></bullet></fire></action>"
                    + "</bulletml>");
    var commands = bulletml.sequence()[0].bullet.sequence();
    assertEquals("wait", commands[0].commandName);
    assertEquals("(5)", commands[0].value);
};

RuntimeTest.prototype.testRank = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'><wait>$rank</wait></action></bulletml>");
    var wait = bulletml.sequence()[0];
    assertEquals("wait", wait.commandName);
    assertEquals("(0)", wait.value);
};

RuntimeTest.prototype.testRank2 = function() {
    var bulletml = BulletML
            .build("<bulletml><action label='top'><wait>$rank</wait></action></bulletml>");
    var wait = bulletml.sequence("top", 0.5)[0];
    assertEquals("wait", wait.commandName);
    assertEquals("(0.5)", wait.value);
};

RuntimeTest.prototype.testBulletRefArg = function() {
    var bulletml = BulletML
            .build("<bulletml>"
                    + "<action label='top'><fire><bulletRef label='b'><param>5</param></bulletRef></fire></action>"
                    + "<bullet label='b'><action><vanish/><wait>$1</wait></action></bullet>"
                    + "</bulletml>");
    var fire = bulletml.sequence()[0];
    assertEquals("fire", fire.commandName);
    var bulSeq = fire.bullet.sequence();
    assertEquals("wait", bulSeq[1].commandName);
    assertEquals("(5)", bulSeq[1].value);
};

RuntimeTest.prototype.testBulletRefArg2 = function() {
    var bulletml = BulletML
            .build("<bulletml>"
                    + "<action label='top'><fire><bulletRef label='b'><param>5</param></bulletRef></fire></action>"
                    + "<bullet label='b'>"
                    + "<action><repeat><times>3</times><action><wait>$1</wait></action></repeat></action>"
                    + "</bullet></bulletml>");
    var fire = bulletml.sequence()[0];
    assertEquals("fire", fire.commandName);
    assertEquals(1, fire.bullet.actions.length);
    assertEquals("repeat", fire.bullet.actions[0].commands[0].commandName);
    assertEquals("wait",
            fire.bullet.actions[0].commands[0].action.commands[0].commandName);
    assertEquals("(5)",
            fire.bullet.actions[0].commands[0].action.commands[0].value);
    var bulSeq = fire.bullet.sequence();
    assertEquals(3, bulSeq.length);
    assertEquals("wait", bulSeq[1].commandName);
    assertEquals("(5)", bulSeq[1].value);
};

RuntimeTest.prototype.testRefRepeat = function() {
    var bulletml = BulletML
            .build("<bulletml>"
                    + "<action label='top'><actionRef label='a2'><param>5</param></actionRef></action>"
                    + "<action label='a2'><repeat><times>3</times><action><wait>$1</wait></action></repeat></action>"
                    + "</bulletml>");
    var commands = bulletml.sequence();
    assertEquals("wait", commands[1].commandName);
    assertEquals("(5)", commands[1].value);
};
