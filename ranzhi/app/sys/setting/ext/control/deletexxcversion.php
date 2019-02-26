<?php
class setting extends control
{
    public function deleteXXCVersion($versionID = 0)
    {
        $this->dao->delete()->from(TABLE_IM_XXCVERSION)->where('id')->eq($versionID)->exec();
        if(dao::isError()) $this->send(array('result' => 'fail', 'message' => dao::getError()));
        $this->send(array('result' => 'success', 'message' => $this->lang->deleteSuccess, 'locate' => inlink('xxcVersion')));
    }
}