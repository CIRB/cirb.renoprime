from zope.interface import implements, Interface
from zope.component import getUtility
from plone.registry.interfaces import IRegistry

from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName

from datetime import datetime

from cirb.renoprime import renoprimeMessageFactory as _


class IMapView(Interface):
    """
    Map view interface
    """

    def test():
        """ test method"""


class MapView(BrowserView):
    """
    Map browser view
    """
    implements(IMapView)

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.registry = getUtility(IRegistry)

    @property
    def portal_catalog(self):
        return getToolByName(self.context, 'portal_catalog')

    @property
    def portal(self):
        return getToolByName(self.context, 'portal_url').getPortalObject()

    def test(self):
        """
        test method
        """
        dummy = _(u'a dummy string')

        return {'dummy': dummy}

    def get_today(self):
        today = datetime.now()
        return today.strftime('%Y-%m-%d')

    @property
    def gis_localization_url_prefix(self):
        url = self.registry.get(
            'cirb.renoprime.gis_localization_url_prefix',
            'https://geoservices.irisnet.be/localization')
        if url.endswith('/'):
            url = url[:-1]
        return url

    @property
    def gis_basemap_url_prefix(self):
        url = self.registry.get(
            'cirb.renoprime.gis_basemap_url_prefix',
            'https://geoservices-urbis.irisnet.be')
        if url.endswith('/'):
            url = url[:-1]
        return url


class GetToday(BrowserView):
    def __init__(self, context, request):
        self.context = context
        self.request = request

    def get_today(self):
        today = datetime.now()
        return today.strftime('%Y-%m-%d')
