######################################################################################################
# Functions

function message {
    printf "\033[0;33m$1\033[0m$2\n"
}

function command_exists () {
    type "$1" &> /dev/null ;
}
