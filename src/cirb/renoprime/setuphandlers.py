import os
from zope.component import getUtility
from plone.registry.interfaces import IRegistry


def setup(context):
    logger = context.getLogger("cirb.renoprime")
    if context.readDataFile('cirb.renoprime_various.txt') is None:
        return
    env = os.environ.get('DEPLOY_ENV', "")
    logger.info("Env: {0}".format(env))
    if env in ["staging", "dev"]:
        registry = getUtility(IRegistry)
        registry['cirb.renoprime.gis_url'] = 'http://gis.irisnetlab.be/'
        logger.info("Registry gis_url is now: {0}".format(registry['cirb.renoprime.gis_url']))
        #registry['cirb.renoprime.my_brugis_url'] = 'http://www.mybrugis.irisnetlab.be/'
        #logger.info("Registry my_brugis_url is now: {0}".format(registry['cirb.renoprime.my_brugis_url']))
