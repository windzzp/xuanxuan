<?php
class chat extends control
{
    public function createGroup($amount = 2)
    {
        $timeStart = microtime(true);
        $groupList = array();

        $count = $this->dao->select("count('id') AS value")->from(TABLE_USER)->where('deleted')->eq('0')->fetch('value');
        for($i = 0; $i < $amount; $i++)
        {
            $members = $this->dao->select('id')->from(TABLE_USER)->where('deleted')->eq('0')->limit(rand(3, $count))->fetchAll('id');
            $members = array_keys($members);
            $name    = 'Group' . rand() . $i;
            $gid     = $this->chat->createGID();
            if($this->chat->create($gid, $name, 'group', $members, 0, false, end($members)))
            {
                $groupList[] = $gid;
            }
        }
        $timeEnd = microtime(true);

        $this->output->result = 'success';
        $this->output->time   = round($timeEnd - $timeStart, 3);
        $this->output->data   = $groupList;
        die($this->app->encrypt($this->output));
    }
}