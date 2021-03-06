# -*- coding: UTF-8
#
# wizard

from globaleaks.handlers.base import BaseHandler
from globaleaks.handlers.authentication import authenticated, transport_security_check
from globaleaks.handlers.admin import db_create_context, db_create_receiver, \
        db_update_node
from globaleaks.handlers.node import anon_serialize_node
from globaleaks.rest import requests
from globaleaks.rest.apicache import GLApiCache
from globaleaks.settings import transact
from globaleaks.utils.utility import log

from twisted.internet.defer import inlineCallbacks


@transact
def wizard(store, request, language):
    node = request['node']
    context = request['context']
    receiver = request['receiver']

    node['default_language'] = language
    node['languages_enabled'] = [language]

    # Header title of the homepage is initially set with the node title
    node['header_title_homepage'] = node['name']

    try:
        db_update_node(store, node, True, language)

    except Exception as excep:
        log.err("Failed Node initialization %s" % excep)
        raise excep

    try:
        context_dict = db_create_context(store, context, language)
    except Exception as excep:
        log.err("Failed Context initialization %s" % excep)
        raise excep

    # associate the new context to the receiver
    receiver['contexts'] = [context_dict['id']]

    try:
        db_create_receiver(store, receiver, language)
    except Exception as excep:
        log.err("Failed Receiver Initialization %s" % excep)
        raise excep


class FirstSetup(BaseHandler):
    """
    """

    @transport_security_check('admin')
    @authenticated('admin')
    @inlineCallbacks
    def post(self):
        """
        """

        request = self.validate_message(self.request.body,
                                        requests.WizardFirstSetupDesc)

        yield wizard(request, self.request.language)

        # cache must be updated in particular to set wizard_done = True
        public_node_desc = yield anon_serialize_node(self.request.language)
        GLApiCache.invalidate()

        self.set_status(201)  # Created
        self.finish()

