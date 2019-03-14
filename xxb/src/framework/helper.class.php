<?php
/**
 * Helper类从baseHelper类继承而来，您可以在这个文件中对其进行扩展。
 * This helper class extends from the baseHelper class, and you can
 * extend it by change this helper.class.php file.
 *
 * @package framework
 *
 * The author disclaims copyright to this source code. In place of
 * a legal notice, here is a blessing:
 * 
 *  May you do good and not evil.
 *  May you find forgiveness for yourself and forgive others.
 *  May you share freely, never taking more than you give.
 */
include FRAME_ROOT . '/base/helper.class.php';
class helper extends baseHelper
{
    /**
     * Merge config items in database and config files.
     * 
     * @param  array  $dbConfig 
     * @param  string $moduleName 
     * @static
     * @access public
     * @return void
     */
    public static function mergeConfig($dbConfig, $moduleName = 'common')
    {
        global $config;

        $config2Merge = $config;
        if($moduleName != 'common') $config2Merge = $config->$moduleName;

        foreach($dbConfig as $item)
        {
            foreach($item as $record)
            {
                if(!is_object($record))
                {
                    $config2Merge->{$item->key} = $item->value;
                    break;
                }

                if(!isset($config2Merge->{$record->section})) $config2Merge->{$record->section} = new stdclass();
                if($record->key) $config2Merge->{$record->section}->{$record->key} = $record->value;
            }
        }
    }

    /**
     * Encode json for $.parseJSON
     * 
     * @param  array  $data 
     * @param  int    $options 
     * @static
     * @access public
     * @return string
     */
    static public function jsonEncode4Parse($data, $options = 0)
    {
        $json = json_encode($data);
        if($options) $json = str_replace(array("'", '"'), array('\u0027', '\u0022'), $json);

        $escapers     = array("\\",  "/",   "\"", "'", "\n",  "\r",  "\t", "\x08", "\x0c", "\\\\u");
        $replacements = array("\\\\", "\\/", "\\\"", "\'", "\\n", "\\r", "\\t",  "\\f",  "\\b", "\\u");
        return str_replace($escapers, $replacements, $json);
    }

    /**
     * Unify string to standard chars.
     * 
     * @param  string    $string 
     * @param  string    $to 
     * @static
     * @access public
     * @return string
     */
    public static function unify($string, $to = ',')
    {
        $labels = array('_', '、', ' ', '-', '?', '@', '&', '%', '~', '`', '+', '*', '/', '\\', '，', '。');
        $string = str_replace($labels, $to, $string);
        return preg_replace("/[{$to}]+/", $to, trim($string, $to));
    }
}

/**
 * Check exist onlybody param.
 * 
 * @access public
 * @return void
 */
function isonlybody()
{
    return (isset($_GET['onlybody']) and $_GET['onlybody'] == 'yes');
}

/**
 * Format time.
 * 
 * @param  int    $time 
 * @param  string $format 
 * @access public
 * @return void
 */
function formatTime($time, $format = '')
{
    $time = str_replace('0000-00-00', '', $time);
    $time = str_replace('00:00:00', '', $time);
    if(trim($time) == '') return ;
    if($format) return date($format, strtotime($time));
    return trim($time);
}
