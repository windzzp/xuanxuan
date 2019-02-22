<?php
class chat extends control
{
    public function createUser($amount = 10, $prefix = 'test', $password = '123456')
    {
        $timeStart = microtime(true);
        $userList  = array();
        
        for($i = 0; $i < $amount; $i++)
        {
            $user = new stdClass();
            $user->account  = $prefix . $i;
            $user->password = $this->loadModel('user')->createPassword($password, $user->account);
            $this->dao->delete()->from(TABLE_USER)->where('account')->eq($user->account)->exec();
            $this->dao->insert(TABLE_USER)->data($user) ->autoCheck()->check('account', 'unique')->check('account', 'account')->exec();
            $userList[$this->dao->lastInsertID()] = $user->account;
        }
        
        $timeEnd = microtime(true);

        $this->output->result = 'success';
        $this->output->time   = round($timeEnd - $timeStart, 3);
        $this->output->data   = $userList;
        die($this->app->encrypt($this->output));
    }
}