<?php
public function execute($fromVersion)
{
    $xxbVersion = !empty($this->config->version) ? $this->config->version : '1.0';
    switch($fromVersion)
    {
        case '1_0'   :
        case '1_1'   :
        case '1_2'   : $this->execSQL($this->getUpgradeFile('xxb1.2'));
        case '2_0_0' :
        case '2_1_0' :
        case '2_2_0' :
        case '2_3_0' :
        case '2_4_0'   : $this->execSQL($this->getUpgradeFile('xxb2.4.0'));
        default : $this->loadModel('setting')->updateVersion($this->config->version);
    }
}
