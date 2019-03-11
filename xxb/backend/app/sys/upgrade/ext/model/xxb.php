<?php
public function execute($fromVersion)
{
    $xxbVersion = !empty($this->config->version) ? $this->config->version : '1.0';
    switch($xxbVersion)
    {
        case '1_0'   :
        case '1_1'   :
        case '1_2'   : $this->execSQL($this->getUpgradeFile('upgradexxb1.2.sql'));
        case '2_0_0' :
        case '2_1_0' :
        case '2_2_0' :
        case '2_3_0' :
        case '2_4_0' :
        case '2_4_1' :
        default : $this->loadModel('setting')->updateVersion($this->config->version);
    }
}
