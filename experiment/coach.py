from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import json
import time

driver = webdriver.Chrome()
driver.get("http://www.coach.com/shop/women-handbags-new-arrivals")
for i in xrange(6):
    driver.execute_script('window.scroll(0, 1000000)')
    time.sleep(10)

driver.save_screenshot('coach-bags-new-arrival.png')
item_list = driver.find_elements_by_class_name("prod-grid")
bags_list = []
for item in item_list:
    product_name = item.find_element_by_class_name('product-name')
    product_img = item.find_element_by_class_name('product-image')
    img_el = product_img.find_element_by_tag_name('img')
    img_urls = [img_el.get_attribute('src')]
    metas = product_name.find_elements_by_tag_name('meta')
    nameMeta = metas[0]
    name = nameMeta.get_attribute('content')
    product_id = metas[1].get_attribute('content')
    bag = {
        'name': name,
        'productId': product_id,
        'imgs': img_urls
    }
    bags_list.append(bag)
with open('coach-bags-new-arrival.json', 'w') as f:
  f.write(json.dumps(bags_list, sort_keys=True, indent=4, separators=(',', ': ')))
print('Total {0} bags parsed.'.format(len(bags_list)))
driver.close()
